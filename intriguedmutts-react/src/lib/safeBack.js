export function safeBack(navigate, fallback = "/") {
  // If user has navigation history, go back.
  // If not (direct landing / new tab), go home instead.
  if (window.history.length > 1) navigate(-1);
  else navigate(fallback, { replace: true });
}
