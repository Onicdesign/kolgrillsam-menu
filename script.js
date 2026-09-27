const categories = [
  { id:'grill', title:'Kolgrillade rätter', items:[
    [1,'Shish kebab','13'],[2,'Shish kebab & kycklingfilé','11'],[3,'Shish kebab & rulle','8'],[4,'Shish kebab & lammspett','12'],[5,'Lammspett','10'],[6,'Lammspett & kycklingfilé','9'],[7,'Lammspett & lammracks','18'],[8,'Kycklingfilé','17'],[9,'Kycklingvingar','15'],[10,'Laxspett','19'],[11,'Oxfilé','16'],[12,'Rulle','14'],[13,'Lammkotlett','24'],[14,'Lammracks','22'],[15,'Shish kebab, lammspett & kycklingfilé','21'],[16,'Shish kebab, lammspett & rulle','25'],[17,'Laxspett, vegetariskt & champinjoner','23'],[18,'Lammkotlett, rulle, lammracks & shish kebab','20']
  ]},
  { id:'special', title:'Kolgrill Sams special', items:[
    [19,'Tandur samsa','5'],[20,'Manti','3'],[21,'Halisa (halim)','2'],[22,'Tabaka (hel kyckling)','4'],[23,'Osh','1'],[24,'Jiz','jiz']
  ]},
  { id:'lagman', title:'Lagman', items:[[25,'Stekt lagman','7'],[26,'Lagman','6']]},
  { id:'soppor', title:'Soppfavoriter', items:[[27,'Chuchvara','chuchvara'],[28,'Borsh','borsh'],[29,'Shorva','shorva']]},
  { id:'kebab', title:'Kebabrätter', items:[[30,'Kycklingrulle','30'],[31,'Kebabrulle','28'],[32,'Falafelrulle','26'],[33,'Kycklingtallrik','31'],[34,'Kebabtallrik','29'],[35,'Falafeltallrik','27'],[36,'Kyckling med bröd','poster-kebab-0'],[37,'Kebab med bröd','poster-kebab-1'],[38,'Falafel med bröd','poster-kebab-2']]},
  { id:'sallader', title:'Sallader', items:[[39,'Kycklingsallad','33'],[40,'Smaksallad','smaksallad'],[41,'Fransk sallad','poster-sallad'],[42,'Grekisk sallad','34'],[43,'Tashkent sallad','tashkent'],[44,'Kebabsallad','32']]}
];
const imageFile = key => /^\d+$/.test(key) || key === 'jiz' ? `assets/dish-${key}.png` : `assets/${key}.jpg`;
function imageMarkup(key, name) {
  if (key.startsWith('poster-kebab')) { const col = Number(key.slice(-1)); return `<div class="poster-image poster-kebab poster-col-${col}" role="img" aria-label="${name}, med pris i bilden"></div>`; }
  if (key === 'poster-sallad') return `<div class="poster-image poster-sallad" role="img" aria-label="${name}, med pris i bilden"></div>`;
  return `<img src="${imageFile(key)}" alt="${name}, med pris i bilden" loading="lazy" />`;
}
const nav = document.querySelector('#category-nav');
nav.innerHTML = categories.map((category,index) => `<a href="#${category.id}" class="${index===0?'active':''}">${category.title}</a>`).join('');
const content = document.querySelector('#menu-content');
content.innerHTML = categories.map(category => `<section class="menu-group" id="${category.id}" aria-labelledby="${category.id}-title"><div class="group-heading reveal"><span class="group-line"></span><h3 id="${category.id}-title">${category.title}</h3><span class="group-count">${category.items.length} rätter</span></div><div class="dish-grid">${category.items.map(([number,name,image])=>`<article class="dish reveal"><div class="dish-photo">${imageMarkup(image,name)}</div><div class="dish-caption"><span class="dish-number">${String(number).padStart(2,'0')}</span><h4>${name}</h4></div></article>`).join('')}</div></section>`).join('');

const sections = [...document.querySelectorAll('.menu-group')];
const navLinks = [...document.querySelectorAll('.category-scroll a')];
const navObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
}, {rootMargin:'-140px 0px -55% 0px',threshold:[0,.1,.5]});
sections.forEach(section => navObserver.observe(section));
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('seen');revealObserver.unobserve(entry.target);}}); },{threshold:.08,rootMargin:'0px 0px 80px 0px'});
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('seen'));
let toastTimer;
function showToast(message) { const toast=document.querySelector('#toast'); toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3200); }
async function shareMenu() {
  const data={title:'Kolgrill Sam – meny med priser',text:'Se Kolgrill Sams meny och priser',url:location.href.split('#')[0]};
  if(location.protocol==='file:'){showToast('Publicera sidan för att få en delbar länk.');return;}
  if(navigator.share){try{await navigator.share(data);return;}catch(error){if(error.name==='AbortError')return;}}
  try{await navigator.clipboard.writeText(data.url);showToast('Länken är kopierad!');}catch{showToast('Kopiera länken i adressfältet.');}
}
document.querySelectorAll('#share-top,#share-bottom').forEach(button=>button.addEventListener('click',shareMenu));
