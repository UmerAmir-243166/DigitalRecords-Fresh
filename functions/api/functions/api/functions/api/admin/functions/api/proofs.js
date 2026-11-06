export async function onRequest({ request, env }) {
  const kv = env.MY_KV;
  const headers = { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" };
  const state = await kv.get("shop_state", {type:"json"}) || { paymentProofs: [] };
  if (request.method==="GET") {
    return new Response(JSON.stringify(state.paymentProofs || []), { headers });
  }
  if (request.method==="POST" || request.method==="PUT") {
    const body = await request.json().catch(()=>({}));
    if (body.paymentProofs) state.paymentProofs = body.paymentProofs;
    await kv.put("shop_state", JSON.stringify(state));
    return new Response(JSON.stringify(state.paymentProofs || []), { headers });
  }
  return new Response("Method not allowed", {status:405, headers});
}
