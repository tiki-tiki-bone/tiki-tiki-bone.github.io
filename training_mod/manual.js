'use strict';
// Apply the header change to already-generated pages without changing draft HTML.
const siteHeader=document.querySelector('.site-header');
siteHeader?.querySelector('nav')?.remove();
siteHeader?.querySelectorAll('a[href^="http"]').forEach(link=>{const label=document.createElement('span');label.className=link.className;label.textContent=link.textContent;link.replaceWith(label);});
if(siteHeader?.querySelector('.brand'))siteHeader.querySelector('.brand').textContent='PS2版北斗の拳 TRAINING MOD';
const sections=[...document.querySelectorAll('[data-search]')];
const links=[...document.querySelectorAll('.sidebar nav a')];
const search=document.querySelector('#search');
if(matchMedia('(max-width:800px)').matches)document.querySelector('#toc').open=false;
const normalize=s=>s.normalize('NFKC').toLocaleLowerCase('ja');
const texts=sections.map(s=>normalize(s.textContent));
function filter(){
 const words=normalize(search.value).trim().split(/\s+/).filter(Boolean);
 let count=0;
 sections.forEach((s,i)=>{const show=words.every(w=>texts[i].includes(w));s.hidden=!show;links[i].hidden=!show;if(show)count++;});
 document.querySelector('#search-status').textContent=words.length?`${count} / ${sections.length}件が一致`:`全${sections.length}件`;
 document.querySelector('#no-results').hidden=count!==0;
 const prefaceVisible=sections.some(s=>['usage-notice','changelog'].includes(s.id)&&!s.hidden);
 const bodyVisible=sections.some(s=>!['usage-notice','changelog'].includes(s.id)&&!s.hidden);
 for(const [selector,visible] of [['.toc-preface-label',prefaceVisible],['.toc-body-label',bodyVisible],['.manual-body-divider',bodyVisible]]){const label=document.querySelector(selector);if(label)label.hidden=!visible;}
}
search.addEventListener('input',filter);
document.querySelector('#clear').addEventListener('click',()=>{search.value='';filter();search.focus();});
links.forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=800)document.querySelector('#toc').open=false;}));
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'-5% 0px -65% 0px'});
sections.forEach(s=>observer.observe(s));
const dialog=document.querySelector('#lightbox');
let trigger;
document.querySelectorAll('.zoom').forEach(button=>button.addEventListener('click',()=>{trigger=button;dialog.querySelector('img').src=button.dataset.image;dialog.querySelector('img').alt=button.querySelector('img').alt;dialog.querySelector('p').textContent=button.closest('figure').querySelector('figcaption').textContent;dialog.showModal();}));
document.querySelector('#close-image').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>trigger?.focus());

filter();
