(() => {
  const NS='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visible=new Set();
  const timers=new Map();
  const el=(tag,a={})=>{const n=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>n.setAttribute(k,v));return n};
  const text=(x,y,t,cls='pv-label')=>{const n=el('text',{x,y,class:cls});n.textContent=t;return n};
  const line=(x1,y1,x2,y2,cls='pv-line')=>el('line',{x1,y1,x2,y2,class:cls});
  const circle=(cx,cy,r,cls='pv-node')=>el('circle',{cx,cy,r,class:cls});
  const group=(cls='')=>el('g',{class:cls});
  const svg=()=>el('svg',{viewBox:'0 0 520 360',class:'programme-svg',role:'presentation'});
  const later=(box,fn,ms)=>{const id=setTimeout(fn,ms);(timers.get(box)||timers.set(box,[]).get(box)).push(id)};
  const clear=(box)=>{(timers.get(box)||[]).forEach(clearTimeout);timers.set(box,[])};

  function grammar(box){
    const s=svg(), atoms=group('pv-atoms');
    const ex=text(125,105,'∃','pv-symbol pv-teal'), P=text(265,250,'P','pv-symbol'), x=text(390,250,'x','pv-symbol');
    atoms.append(ex,P,x); s.append(atoms);
    const low=group('pv-stage'); low.append(line(327,165,265,222),line(327,165,390,222)); s.append(low);
    const high=group('pv-stage'); high.append(line(205,70,125,92),line(205,70,327,165)); s.append(high);
    box.append(s);
    const cycle=()=>{clear(box);low.classList.remove('on');high.classList.remove('on');ex.classList.remove('on');P.classList.remove('on');x.classList.remove('on');
      later(box,()=>{P.classList.add('on');x.classList.add('on')},300);
      later(box,()=>low.classList.add('on'),1500);
      later(box,()=>ex.classList.add('on'),3000);
      later(box,()=>high.classList.add('on'),4100);
      later(box,cycle,7600)};
    if(reduced){[low,high].forEach(g=>g.classList.add('on'));[ex,P,x].forEach(n=>n.classList.add('on'))} else cycle();
  }

  function expectation(box){
    const s=svg(); s.append(line(45,250,475,250,'pv-axis'));
    const words=[text(80,242,'w₁','pv-word on'),text(205,242,'w₂','pv-word'),text(330,242,'w₃','pv-word'),text(455,242,'w₄','pv-word')]; words.forEach(n=>s.append(n));
    const paths=[
      'M125 250 C136 250 143 245 150 231 C158 214 165 183 171 155 C177 183 184 214 192 231 C199 245 206 250 217 250 Z',
      'M250 250 C259 250 266 245 271 230 C277 209 281 170 286 147 C290 171 296 195 306 214 C318 237 334 247 350 250 Z',
      'M375 250 C384 250 390 244 396 228 C402 211 408 186 414 174 C420 190 427 216 436 226 C443 217 450 193 457 183 C464 197 471 223 479 237 C485 246 491 250 498 250 Z'];
    const ds=paths.map(d=>{const g=group('pv-dist');g.append(el('path',{d,class:'pv-dist-fill'}),el('path',{d:d.replace(/ Z$/,''),class:'pv-dist-edge'}));s.append(g);return g}); box.append(s);
    let i=0; const reset=()=>{words.slice(1).forEach(w=>w.classList.remove('on'));ds.forEach(d=>d.classList.remove('on'));i=0;ds[0].classList.add('on')};
    const cycle=()=>{clear(box);reset(); const step=()=>{const d=ds[i],w=words[i+1];d.classList.remove('on');w.classList.add('on');i++;if(i<ds.length){later(box,()=>ds[i].classList.add('on'),650);later(box,step,2800)}else later(box,cycle,2200)};later(box,step,2400)};
    if(reduced){words.forEach(w=>w.classList.add('on'));ds[2].classList.add('on')}else cycle();
  }

  function alternatives(box){
    const s=svg(), w1=text(205,190,'w₁','pv-word on'), w2=text(405,190,'w₂','pv-word');s.append(w1,w2);
    const pts=[[120,80,18],[205,65,12],[292,105,22],[105,190,10],[285,190,13],[135,285,21],[225,300,11],[310,265,17]];
    const alts=pts.map(([x,y,r],i)=>{const g=group('pv-alt');g.append(line(205,185,x,y,'pv-solid-soft'),circle(x,y,r,i%3===0?'pv-node pv-teal-node':'pv-node'));s.insertBefore(g,w1);return g});
    const links=[[292,105],[285,190],[310,265]].map(([x,y])=>{const l=line(405,185,x,y,'pv-coherence');s.append(l);return l}); box.append(s);
    const cycle=()=>{clear(box);alts.forEach(a=>a.classList.remove('on'));links.forEach(l=>l.classList.remove('on'));w2.classList.remove('on');alts.forEach((a,i)=>later(box,()=>a.classList.add('on'),600+i*170));later(box,()=>w2.classList.add('on'),2700);links.forEach((l,i)=>later(box,()=>l.classList.add('on'),3700+i*250));later(box,()=>{alts[3].classList.remove('on');alts[6].classList.remove('on')},5000);later(box,cycle,7600)};
    if(reduced){alts.forEach(a=>a.classList.add('on'));w2.classList.add('on');links.forEach(l=>l.classList.add('on'))}else cycle();
  }

  function memory(box){
    const s=svg();
    function net(cx,cy,labels,cls){const g=group(cls);const pos=[[0,0],[-38,-42],[43,-35],[-32,47],[42,45]];pos.slice(0,labels.length).forEach(([dx,dy],i)=>{if(i)g.append(line(cx,cy,cx+dx,cy+dy,'pv-memory-line'));g.append(circle(cx+dx,cy+dy,i?13:16,'pv-memory-node'));g.append(text(cx+dx,cy+dy+5,labels[i],'pv-feature'))});return g}
    const old1=net(95,190,['f₁','f₂','f₃'],'pv-memory trace'),old2=net(245,190,['f₁','f₄','f₃'],'pv-memory trace'),cur=net(410,190,['f₁','f[ ]','f₄'],'pv-memory current');s.append(old1,old2,cur);
    const retrieve=el('path',{d:'M 74 145 C 165 78, 305 80, 410 145',class:'pv-retrieve'});s.append(retrieve);box.append(s);
    const target=cur.querySelectorAll('.pv-feature')[1],source=old1.querySelectorAll('.pv-feature')[1],sourceNode=old1.querySelectorAll('.pv-memory-node')[1];
    const cycle=()=>{clear(box);old1.classList.remove('seen','react');old2.classList.remove('seen');cur.classList.remove('seen');retrieve.classList.remove('on');target.textContent='f[ ]';source.classList.remove('react');sourceNode.classList.remove('react');
      later(box,()=>old1.classList.add('seen'),400);later(box,()=>old2.classList.add('seen'),1700);later(box,()=>cur.classList.add('seen'),3000);later(box,()=>{old1.classList.add('react');source.classList.add('react');sourceNode.classList.add('react');retrieve.classList.add('on')},4400);later(box,()=>target.textContent='f₂',5900);later(box,cycle,8500)};
    if(reduced){old1.classList.add('seen','react');old2.classList.add('seen');cur.classList.add('seen');retrieve.classList.add('on');target.textContent='f₂'}else cycle();
  }

  const makers={'grammatical-structure':grammar,'expectation-inference':expectation,'alternatives-coherence':alternatives,'meaning-memory':memory};
  document.querySelectorAll('.programme-visual').forEach(box=>makers[box.dataset.visual]?.(box));

  // Pause timers while programme visuals are well outside the viewport by toggling CSS motion.
  const io=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('pv-visible',e.isIntersecting)),{rootMargin:'150px'});
  document.querySelectorAll('.programme-visual').forEach(v=>io.observe(v));
})();
