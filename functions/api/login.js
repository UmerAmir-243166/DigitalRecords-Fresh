export async function onRequest({ request, env }) {
  const kv = env.MY_KV;
  const headers = { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*" };
  if (request.method!=="POST") return new Response("Method not allowed", {status:405, headers});
  const body = await request.json().catch(()=>({}));
  const state = await kv.get("shop_state", {type:"json"}) || {};
  const adminPass = state.adminPass || "admin123";
  const adminName = state.adminName || "Admin";
  if (body.role==="admin") {
    const user = (body.username||"").toLowerCase();
    if ((user==="admin" || user===adminName.toLowerCase()) && body.password===adminPass) {
      return new Response(JSON.stringify({ token:"admin-token", adminName }), {headers});
    }
    return new Response(JSON.stringify({ error:"Invalid admin" }), {status:401, headers});
  }
  if (body.role==="customer") {
    const cust = (state.customers||[]).find(c=>c.phone===body.phone && c.password===body.password);
    if (cust) return new Response(JSON.stringify({ token:"customer-"+cust.phone, adminName }), {headers});
    return new Response(JSON.stringify({ error:"Invalid customer" }), {status:401, headers});
  }
  return new Response(JSON.stringify({ error:"Invalid role" }), {status:400, headers});
}
