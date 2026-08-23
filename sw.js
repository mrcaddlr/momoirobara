const CACHE="momoirobara-shell-v7";
const ASSETS=["./","./index.html","./manifest.json","./icon.svg"];
const CLEAN=`<style id="momo-hard-clean">
#mobileMenuClose,#momoFixedMenuClose,#momoResponsiveMenuClose,#momoResponsiveMenuBtn,[aria-label="Close menu"],[title="Close menu"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
</style><script id="momo-hard-clean-js">(()=>{const kill=()=>{document.querySelectorAll('#mobileMenuClose,#momoFixedMenuClose,#momoResponsiveMenuClose,#momoResponsiveMenuBtn,[aria-label="Close menu"],[title="Close menu"],#page-lastfm,.lastfm-page,[data-lastfm-page],[data-page="lastfm"],[data-page="last-fm"],.lastfm-view,.lastfm-screen,.lastfm-panel').forEach(e=>e.remove());document.querySelectorAll('.nav button,.nav a,.side button,.side a,.sidebar button,.sidebar a').forEach(e=>{const t=(e.textContent||'').trim().toLowerCase();if(t==='last.fm'||t==='lastfm'||t==='last fm')e.remove()})};kill();new MutationObserver(kill).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
async function clean(response){
  if(!response||!response.ok)return response;
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html"))return response;
  try{
    const html=await response.text();
    if(html.includes('id="momo-hard-clean"'))return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
    const patched=html.replace(/<\/body\s*>/i,CLEAN+"</body>");
    const headers=new Headers(response.headers);headers.delete("content-length");
    return new Response(patched,{status:response.status,statusText:response.statusText,headers});
  }catch(e){return response}
}
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  const request=event.request,url=new URL(request.url);
  if(url.origin!==location.origin||url.pathname.includes("/api/"))return;
  if(request.mode==="navigate"||request.destination==="document"){
    event.respondWith(fetch(request,{cache:"no-store"}).then(clean).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(request,copy));return response}).catch(()=>caches.match(request).then(clean)));return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(request,copy));return response})));
});
