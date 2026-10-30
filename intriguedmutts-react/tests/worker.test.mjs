import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../../worker/mutts-paypal.mjs';
const origin='https://intriguedmutts.com';
const response=data=>new Response(JSON.stringify(data));
function setup(){
 const entries=new Map();
 const env={CART_TOKEN_SECRET:'test-only',PRINTFUL_API_KEY:'mock',PAYPAL_CLIENT_ID:'mock',PAYPAL_SECRET:'mock',ORDERS:{get:async k=>entries.get(k),put:async(k,v)=>entries.set(k,v)}};
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
