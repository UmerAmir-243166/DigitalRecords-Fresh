export async function onRequest({ request, env }) {
  const kv = env.MY_KV;
  const headers = { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" };
  if (request.method!=="POST") return new Response("Method not allowed", {status:405, headers});
  const body = await request.json().catch(()=>({}));
  const state = await kv.get("shop_state", {type:"json"}) || {};
  if (body.newName) state.adminName = body.newName;
  if (body.newPassword) state.adminPass = body.newPassword;
  if (body.adminName) state.adminName = body.adminName;
  if (body.adminPass) state.adminPass = body.adminPass;
  await kv.put("shop_state", JSON.stringify(state));
  return new Response(JSON.stringify({ token:"admin-token", adminName: state.adminName || "Admin" }), { headers });
}
