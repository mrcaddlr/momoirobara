(()=>{'use strict';
const kill=()=>{
  document.querySelectorAll('#page-lastfm,.lastfm-page,[data-lastfm-page],[data-page="lastfm"],[data-page="last-fm"],.lastfm-view,.lastfm-screen,.lastfm-panel').forEach(el=>el.remove());
  document.querySelectorAll('.nav button,.nav a,.side button,.side a,.sidebar button,.sidebar a').forEach(el=>{
    const text=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(text==='last.fm'||text==='lastfm'||text==='last fm'||text.includes('last.fm scrobbl')) el.remove();
  });
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',kill,{once:true});else kill();
new MutationObserver(kill).observe(document.documentElement,{childList:true,subtree:true});
})();
