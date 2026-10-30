import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../../worker/mutts-paypal.mjs';
const origin='https://intriguedmutts.com';
const response=data=>new Response(JSON.stringify(data));
function setup(){
 const entries=new Map();
 const env={CHECKOUT_LIMITER:{limit:async()=>({success:true})},CART_TOKEN_SECRET:'test-only',PRINTFUL_API_KEY:'mock',PAYPAL_CLIENT_ID:'mock',PAYPAL_SECRET:'mock',ORDERS:{get:async k=>entries.get(k),put:async(k,v)=>entries.set(k,v)}};
 const req=(path,body,token)=>new Request(`https://worker.test${path}`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});
 return {entries,env,req};
}
test('retail totals ignore client price and reject invalid quantities; no real payment',async()=>{
 const {env,req}=setup();
 let paymentCalls=0;
 globalThis.fetch=async(url)=>{
  if(url==='https://api.printful.com/store/variants/123')return response({result:{id:123,retail_price:'25.00',currency:'USD',name:'Shirt'}});
  if(url==='https://api.printful.com/orders/estimate-costs')return response({result:{costs:{shipping:'5',tax:'0',currency:'USD'}}});
  paymentCalls++;throw Error('Unexpected outbound request');
 };
 const start=await worker.fetch(req('/cart/start',{}),env,{});const {cartToken}=await start.json();
 const cart={currency:'USD',items:[{syncVariantId:123,qty:2,unitPrice:'0.01'}],shipping:{name:'Test',phone:'555',address:{address1:'A',city:'B',state_code:'MD',zip:'20000',country_code:'US'}}};
 const res=await worker.fetch(req('/paypal/estimate',cart,cartToken),env,{});const data=await res.json();
 assert.equal(data.totals.subtotal,'50.00');assert.equal(data.totals.total,'58.00');
 cart.items[0].qty=1.5;
 const bad=await worker.fetch(req('/paypal/estimate',cart,cartToken),env,{});assert.equal((await bad.json()).ok,false);
 assert.equal(paymentCalls,0);
});
test('public cart token cannot capture another order; authorized receipt replay is safe',async()=>{
 const {env,req,entries}=setup();let outbound=0;globalThis.fetch=async()=>{outbound++;throw Error('No network allowed');};
 entries.set('order:ORDER',JSON.stringify({orderId:'ORDER',status:'COMPLETED',successToken:'receipt-secret'}));
 const {cartToken}=await (await worker.fetch(req('/cart/start',{}),env,{})).json();
 const denied=await worker.fetch(req('/paypal/capture',{orderId:'ORDER'},cartToken),env,{});assert.equal(denied.status,401);
 const replay=await worker.fetch(req('/paypal/capture',{orderId:'ORDER',token:'receipt-secret'}),env,{});
 assert.equal(replay.status,200);const data=await replay.json();assert.equal(data.record.successToken,undefined);assert.equal(outbound,0);
});
test('pending capture does not become a completed receipt; capture uses idempotency key',async()=>{
 const {env,req,entries}=setup();
 entries.set('order:ORDER',JSON.stringify({orderId:'ORDER',status:'CREATED',successToken:'receipt-secret'}));
 globalThis.fetch=async(url,options)=>{
  if(url.endsWith('/v1/oauth2/token'))return response({access_token:'mock'});
  assert.equal(options.headers['PayPal-Request-Id'],'capture-ORDER');
  return response({status:'COMPLETED',purchase_units:[{payments:{captures:[{id:'CAP',status:'PENDING',amount:{value:'25.00',currency_code:'USD'}}]}}]});
 };
 const result=await worker.fetch(req('/paypal/capture',{orderId:'ORDER',token:'receipt-secret'}),env,{});
 const data=await result.json();assert.equal(data.record.status,'PENDING');assert.equal(data.record.successToken,undefined);
});
test('unsigned fulfillment webhook is rejected without outbound requests',async()=>{
 const {env,req}=setup();env.PAYPAL_WEBHOOK_ID='mock';globalThis.fetch=async()=>{throw Error('Unexpected network');};
 const result=await worker.fetch(req('/api/paypal/webhook',{id:'fake',event_type:'PAYMENT.CAPTURE.COMPLETED'}),env,{waitUntil(){throw Error('Must not fulfill');}});
 assert.equal(result.status,401);
});

test('checkout rejects bots, wrong hostnames, wrong actions, and replayed tokens before provider calls',async()=>{
 const {env,req}=setup();env.TURNSTILE_SECRET='mock-turnstile';
 let result={success:false};let verified=0;let providerCalls=0;
 globalThis.fetch=async url=>{if(url.includes('/siteverify')){verified++;return response(result);}providerCalls++;throw Error('Provider must not be called');};
 const {cartToken}=await (await worker.fetch(req('/cart/start',{}),env)).json();
 for(const data of [{success:false},{success:true,action:'login',hostname:'intriguedmutts.com'},{success:true,action:'checkout',hostname:'localhost'},{success:true,action:'checkout',hostname:'attacker.test'}]){
  result=data;const denied=await worker.fetch(req('/paypal/order',{turnstileToken:'bad'},cartToken),env);assert.equal(denied.status,403);
 }
 const missing=await worker.fetch(req('/paypal/order',{},cartToken),env);assert.equal(missing.status,403);
 result={success:true,action:'checkout',hostname:'intriguedmutts.com'};
 const accepted=await worker.fetch(req('/paypal/order',{turnstileToken:'once',items:[]},cartToken),env);assert.equal(accepted.status,400);
 result={success:false,'error-codes':['timeout-or-duplicate']};
 const replay=await worker.fetch(req('/paypal/order',{turnstileToken:'once',items:[]},cartToken),env);assert.equal(replay.status,403);
 assert.equal(providerCalls,0);assert.equal(verified,6);
});

test('rate limits, disallowed origins, oversized input and invalid JSON fail without provider calls',async()=>{
 const {env,req}=setup();globalThis.fetch=async()=>{throw Error('No provider calls');};
 env.CHECKOUT_LIMITER.limit=async()=>({success:false});
 const limited=await worker.fetch(req('/cart/start',{}),env);assert.equal(limited.status,429);assert.equal(limited.headers.get('Retry-After'),'60');
 env.CHECKOUT_LIMITER.limit=async()=>({success:true});
 const raw=(body,origin)=>new Request('https://worker.test/cart/start',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body});
 assert.equal((await worker.fetch(raw('{}','https://evil.app.github.dev'),env)).status,403);
 assert.equal((await worker.fetch(raw('bad',origin),env)).status,400);
 assert.equal((await worker.fetch(raw(JSON.stringify({data:'x'.repeat(65536)}),origin),env)).status,413);
});

function signedWebhook(event) {
 return new Request('https://worker.test/api/paypal/webhook',{method:'POST',headers:{'Content-Type':'application/json','PayPal-Transmission-Id':'test','PayPal-Transmission-Time':'test','PayPal-Cert-Url':'https://api.paypal.com/test','PayPal-Auth-Algo':'test','PayPal-Transmission-Sig':'test'},body:JSON.stringify(event)});
}

test('failed fulfillment remains retryable and recovers the unique external order after a lost response',async()=>{
 const {env,entries}=setup();env.PAYPAL_WEBHOOK_ID='mock';
 const event={id:'EVENT',event_type:'PAYMENT.CAPTURE.COMPLETED',resource:{id:'CAPTURE',status:'COMPLETED',amount:{value:'25.00',currency_code:'USD'},supplementary_data:{related_ids:{order_id:'ORDER'}}}};
 entries.set('order:ORDER',JSON.stringify({orderId:'ORDER',currency:'USD',totals:{total:'25.00'},shipping:{name:'Test'},items:[{syncVariantId:123,qty:1}]}));
 let attempt=0;let lookups=0;
 globalThis.fetch=async(url,options)=>{
  if(url.endsWith('/v1/oauth2/token'))return response({access_token:'mock'});
  if(url.endsWith('/verify-webhook-signature'))return response({verification_status:'SUCCESS'});
  if(url==='https://api.printful.com/orders'){
   assert.equal(JSON.parse(options.body).external_id,'mutts-ORDER');attempt++;
   return new Response('temporary upstream error',{status:attempt===1?503:400});
  }
  if(url==='https://api.printful.com/orders/@mutts-ORDER'){
   lookups++;return lookups===1?new Response('missing',{status:404}):response({result:{id:321,status:'draft'}});
  }
  throw Error('Unexpected request');
 };
 const first=await worker.fetch(signedWebhook(event),env);assert.equal(first.status,503);assert.equal(entries.has('pp:event:v2:EVENT'),false);
 const second=await worker.fetch(signedWebhook(event),env);assert.equal(second.status,200);
 assert.equal(JSON.parse(entries.get('order:ORDER')).printfulOrderId,321);assert.equal(entries.has('pp:event:v2:EVENT'),true);
 const third=await worker.fetch(signedWebhook(event),env);assert.equal(third.status,200);assert.equal(attempt,2);
});

test('a signed but mismatched capture cannot trigger fulfillment',async()=>{
 const {env,entries}=setup();env.PAYPAL_WEBHOOK_ID='mock';let fulfillment=0;
 entries.set('order:ORDER',JSON.stringify({orderId:'ORDER',currency:'USD',totals:{total:'25.00'}}));
 globalThis.fetch=async url=>{
  if(url.endsWith('/v1/oauth2/token'))return response({access_token:'mock'});
  if(url.endsWith('/verify-webhook-signature'))return response({verification_status:'SUCCESS'});
  fulfillment++;throw Error('No fulfillment');
 };
 const bad={id:'EVENT',event_type:'PAYMENT.CAPTURE.COMPLETED',resource:{status:'COMPLETED',amount:{value:'0.01',currency_code:'USD'},supplementary_data:{related_ids:{order_id:'ORDER'}}}};
 const result=await worker.fetch(signedWebhook(bad),env);assert.equal(result.status,409);assert.equal(fulfillment,0);
});
