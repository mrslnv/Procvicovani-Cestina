import { lessons } from './data.js';
import { grade, shuffle, mixedQuestions } from './logic.js';
const main = document.querySelector('main');
const all = lessons.flatMap(l => l.items.map(x => ({...x, kind:l.kind, lesson:l.title})));
const byId = new Map(all.map(x => [x.id,x]));
const KEY = 'elina-cestina-v1';
let saved = {}; let session = null;
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { saved = {}; }
if (saved.session && Array.isArray(saved.session.ids) && saved.session.ids.length && saved.session.ids.every(id => byId.has(id))) session = saved.session;
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist() {
 try { localStorage.setItem(KEY, JSON.stringify({session})); }
 catch { document.querySelector('#storage-note').textContent = 'Prohlížeč nedovoluje uložit postup. Cvičit můžeš dál, ale po zavření se odpovědi ztratí.'; }
}
function goTop() { window.scrollTo({top:0,behavior:'instant'}); }
function home() {
 main.innerHTML = `<section class="hero"><div><p class="eyebrow">TVŮJ MALÝ JAZYKOVÝ TRÉNINK</p><h1>Ahoj Elo,<br>pojď si hrát<br><em>s češtinou.</em></h1><p class="intro">Vyber si, co si dnes procvičíš. Pár úloh, chvilka přemýšlení a zase budeš o kousek dál.</p><div class="hero-tags"><span>✎ Doplňuj</span><span>✓ Zkontroluj</span><span>↻ Zkus znovu</span></div></div><div class="letter-art" aria-hidden="true"><span class="orbit">č</span><span class="big-letter">ě<span class="spark">✦</span></span><span class="art-note">Chyba? Z té se učíme.</span><span class="small-letter">ý</span></div></section>
 ${session ? `<aside class="resume"><div><b>Máš tu rozepsané cvičení</b><p>${escape(session.title)} · ${session.ids.length} úloh</p></div><button id="resume">Pokračovat →</button></aside>`:''}
 <section class="topics"><div class="section-title"><div><p class="eyebrow">VYBER SI SVOU CESTU</p><h2>Co si dnes zkusíš?</h2></div><span>8 oblastí · 128 úloh</span></div><div class="topic-grid">${lessons.map((l,i)=>`<button class="topic t${i%4}" data-lesson="${l.id}"><span class="topic-number">0${i+1}</span><span class="topic-title">${escape(l.title)}</span><span class="topic-desc">${escape(l.desc)}</span><span class="topic-bottom">${l.items.length} úloh v zásobě <b>↗</b></span></button>`).join('')}</div></section>
 <section class="mixed"><div><p class="eyebrow">OD KAŽDÉHO TROCHU</p><h2>Promíchaný test znalostí</h2><p>24 úloh ze všech 8 oblastí. Písmena píšeš sama, bez vybírání možností. Každá další otázka je z jiné oblasti.</p></div><button id="mixed">Spustit promíchaný test →</button></section><p class="tip">Každá série má 8 úloh. Nová série nabídne další náhodný výběr.</p>`;
 main.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>start(b.dataset.lesson));
 main.querySelector('#mixed').onclick=()=>start('mixed');
 if(session) main.querySelector('#resume').onclick=()=>{renderExercise();goTop();};
}
function start(id, custom, written = id === 'mixed') {
 const lesson = lessons.find(l=>l.id===id);
 const pool = custom ? shuffle(custom) : lesson ? shuffle(all.filter(x=>x.id.startsWith(id+'-'))).slice(0,8) : mixedQuestions(lessons);
 session={title:custom?'Ještě jednou, zvládneš to!':lesson?.title || 'Promíchaný test znalostí', ids:pool.map(x=>x.id), answers:{}, checked:false, written, mode:written?'mixed':'practice'};
 persist(); renderExercise(); goTop();
}
function inputHTML(x,i) {
 const value = session.answers[x.id]?.value || '';
 const label = `Úloha ${i+1}: ${x.q.replace('_','…')}`;
 let control;
 let opts=x.kind==='letter'?['i','í','y','ý']:x.kind==='consonant'?['n','nn']:x.kind==='sz'?['s','z','vz']:x.kind==='prefix'?['roz','bez','vz']:null;
 if(opts && !session.written) control=`<select data-answer="${x.id}" id="a-${x.id}" aria-label="${escape(label)}"><option value="">…</option>${opts.map(v=>`<option value="${v}" ${v===value?'selected':''}>${v}</option>`).join('')}</select>`;
 else control=`<input id="a-${x.id}" data-answer="${x.id}" aria-label="${escape(label)}" value="${escape(value)}" placeholder="${x.kind==='phrase'?'Napiš výraz…':'…'}" autocomplete="off" autocapitalize="off" spellcheck="false" class="${x.kind==='phrase'?'phrase':'short'}">`;
 if(x.kind==='phrase') return `<label for="a-${x.id}" class="phrase-prompt">${escape(x.q)}</label>${control}`;
 const [before,after]=x.q.split('_');
 const instruction=session.written && x.kind==='prefix' ? 'Doplň roz-, bez-, vz- nebo předložku bez.' : session.written && x.kind==='sz' ? 'Doplň předponu s-, z- nebo vz-.' : ''; 
 const typeControl = session.written
  ? `<input data-type="${x.id}" aria-label="Úloha ${i+1}: předpona nebo předložka" value="${escape(session.answers[x.id]?.type || '')}" placeholder="Napiš označení…" autocomplete="off" autocapitalize="off" spellcheck="false">`
  : `<select data-type="${x.id}" aria-label="Úloha ${i+1}: předpona nebo předložka"><option value="">Vyber…</option>${['předpona','předložka'].map(v=>`<option ${session.answers[x.id]?.type===v?'selected':''}>${v}</option>`).join('')}</select>`;
 return `${instruction?`<p class="item-instruction">${instruction}</p>`:''}<div class="sentence"><span>${escape(before)}</span>${control}<span>${escape(after)}</span></div>${x.typeAnswer?`<label class="type-label">Je doplněná část předpona, nebo předložka?${typeControl}</label>`:''}`;
}
function renderExercise() {
 const items=session.ids.map(id=>byId.get(id));
 main.innerHTML=`<nav class="exercise-nav"><button id="home" class="link">← Všechna cvičení</button><span>${items.length} úloh · bez spěchu</span></nav><section class="exercise-head"><p class="eyebrow">CHVILKA PRO ČEŠTINU</p><h1>${escape(session.title)}</h1><p>Doplň chybějící písmena. U závorek napiš celý výraz. Potom klepni na „Zkontrolovat“.</p><p class="help">${session.written?'Piš chybějící písmena přímo do políček. Kde se ptáme na druh části slova, napiš „předpona“ nebo „předložka“. Oblast otázky se ukáže až po kontrole.':'V sadě Roz-, bez-, vz- vyber také předponu nebo předložku. Mezeru v zadání doplňovat nemusíš.'}</p><div class="progress-track"><div id="progress-bar"></div></div><p id="progress-text"></p></section><div id="result" role="status" aria-live="polite"></div><form id="exercise"><div class="questions">${items.map((x,i)=>`<article class="question" id="q-${x.id}"><div class="q-top"><span class="q-number">${String(i+1).padStart(2,'0')}</span><span class="q-topic">${session.written && !session.checked?'Zkus to bez nápovědy':escape(x.lesson)}</span></div>${inputHTML(x,i)}<div class="feedback" id="f-${x.id}"></div></article>`).join('')}</div><div class="actions"><button type="submit" id="check">Zkontrolovat ✓</button><button type="button" id="retry" class="secondary" hidden>Procvičit chyby ↻</button><button type="button" id="new" class="secondary">Nová série</button></div></form>`;
 main.querySelector('#home').onclick=()=>{home();goTop();};
 main.querySelector('#new').onclick=()=>{if(confirm('Začít novou sérii? Aktuální odpovědi se nahradí.')) homeNew(items);};
 main.querySelector('#retry').onclick=()=>start('retry',items.filter(x=>!grade(x,session.answers[x.id]).correct),session.written);
 main.querySelector('form').onsubmit=e=>{e.preventDefault();session.checked=true;persist();feedback(); main.querySelector('#result').scrollIntoView({behavior:'smooth',block:'start'});};
 main.querySelectorAll('[data-answer],[data-type]').forEach(el=>el.addEventListener('change',()=>changed(el)));
 main.querySelectorAll('input').forEach(el=>el.addEventListener('input',()=>changed(el)));
 progress(); if(session.checked) feedback();
}
function homeNew(items) {
 if(session.mode==='mixed' || session.written) { start('mixed'); return; }
 const lesson=lessons.find(l=>items.every(x=>x.id.startsWith(l.id+'-')));
 start(lesson?.id || 'mixed');
}
function changed(el) {
 const id=el.dataset.answer||el.dataset.type;
 session.answers[id] ||= {};
 session.answers[id][el.dataset.type?'type':'value']=el.value;
 session.checked=false;
 main.querySelector('#result').replaceChildren();
 main.querySelector('#retry').hidden=true;
 main.querySelectorAll('.question').forEach(q=>{q.classList.remove('correct','wrong','empty');q.querySelector('.feedback').replaceChildren();if(session.written) q.querySelector('.q-topic').textContent='Zkus to bez nápovědy';});
 main.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
 persist(); progress();
}
function progress() {
 const n=session.ids.filter(id=>grade(byId.get(id),session.answers[id]).filled).length;
 main.querySelector('#progress-bar').style.width=`${n/session.ids.length*100}%`;
 main.querySelector('#progress-text').textContent=`Vyplněno ${n} z ${session.ids.length}`;
}
function feedback() {
 const items=session.ids.map(id=>byId.get(id));
 const results=items.map(x=>grade(x,session.answers[x.id]));
 const correct=results.filter(x=>x.correct).length; const empty=results.filter(x=>!x.filled).length;
 main.querySelector('#result').innerHTML=`<section class="result ${correct===items.length?'perfect':''}"><span class="result-icon">${correct===items.length?'✦':'🌱'}</span><div><h2>${correct===items.length?'Výborně, všechno správně!':'Zkontrolováno. Každý pokus se počítá.'}</h2><p><b>${correct} z ${items.length} správně</b>${empty?` · ${empty} ${empty===1?'úloha čeká na doplnění':'úloh čeká na doplnění'}`:''}. ${correct===items.length?'Můžeš zkusit další sérii.':'Přečti si vysvětlení a oprav odpovědi. Pak je znovu zkontroluj.'}</p></div></section>`;
 items.forEach((x,i)=>{
  const r=results[i],q=main.querySelector('#q-'+x.id),f=q.querySelector('.feedback');
  q.querySelector('.q-topic').textContent=x.lesson;
  q.classList.remove('correct','wrong','empty'); q.classList.add(r.correct?'correct':r.filled?'wrong':'empty');
  q.querySelectorAll('input,select').forEach(el=>el.setAttribute('aria-describedby','f-'+x.id));
  q.querySelector('[data-answer]').setAttribute('aria-invalid',String(!r.wordOK));
  if(x.typeAnswer) q.querySelector('[data-type]').setAttribute('aria-invalid',String(!r.typeOK));
  f.innerHTML=`<b>${r.correct?'✓ Správně!':!r.filled?'○ Ještě doplň odpověď.':'↻ Tady to zkus opravit.'}</b>${r.correct||r.filled?`<p>${!r.correct?`Správně: <strong>${escape(x.answers.join(' / '))}</strong>${x.typeAnswer?' · '+x.typeAnswer:''}. `:''}${escape(x.why)}</p>`:''}`;
 });
 main.querySelector('#retry').hidden=correct===items.length;
}
document.querySelector('.brand').onclick=e=>{e.preventDefault();home();goTop();};
document.querySelector('#sources').onclick=()=>document.querySelector('dialog').showModal();
document.querySelector('.close').onclick=()=>document.querySelector('dialog').close();
home();
