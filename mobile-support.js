(()=>{'use strict';
/* Mobile-only helper. The backup build has no artist pages and no Last.fm UI. */
function disableScrobble(){
  for(const k of ['lastfmScrobble','lastfmScrobbleTrack','scrobbleToLastFm','sendLastFmScrobble']){
    if(k in window) try{window[k]=()=>false}catch{}
  }
  document.querySelectorAll('[data-lastfm-scrobble],[data-scrobble-lastfm]').forEach(x=>x.remove());
}
function cleanLegacyArtistAndLastfm(){
  document.querySelectorAll('#page-artists,.momo-artists-page,#momoArtistsNav,.momo-artists-nav,.momo-artist-card,[data-artist-page]').forEach(x=>x.remove());
  document.querySelectorAll('#page-lastfm,.lastfm-page,[data-lastfm-page],[data-page="lastfm"]').forEach(x=>x.remove());
  document.querySelectorAll('.nav button,.side button,a').forEach(x=>{
    const t=(x.textContent||'').trim().toLowerCase();
    if(t==='artists'||t==='artist'||t==='last.fm'||t==='lastfm'||t.includes('last.fm scrobbl')) x.remove();
  });
}
function start(){
  cleanLegacyArtistAndLastfm();
  disableScrobble();
  setInterval(()=>{cleanLegacyArtistAndLastfm();disableScrobble()},1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();