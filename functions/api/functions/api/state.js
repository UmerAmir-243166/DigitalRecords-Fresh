export async function onRequest({ request, env }) {
  const kv = env.MY_KV;
  const headers = { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" };
  if (request.method==="GET") {
    const state = await kv.get("shop_state", {type:"json"}) || { customers:[], paymentAccounts:[], paymentProofs:[], adminName:"Admin", adminPass:"admin123" };
    return new Response(JSON.stringify(state), { headers });
  }
  if (request.method==="PUT") {
    const body = await request.json().catch(()=>({}));
    const existing = await kv.get("shop_state", {type:"json"}) || {};
    const merged = {
      ...existing,
      ...body,
      customers: body.customers ?? existing.customers ?? [],
      paymentAccounts: body.paymentAccounts ?? existing.paymentAccounts ?? [],
      paymentProofs: body.paymentProofs ?? existing.paymentProofs ?? []
    };
    await kv.put("shop_state", JSON.stringify(merged));
    return new Response(JSON.stringify(merged), { headers });
  }
  return new Response("Method not allowed", {status:405, headers});
}
