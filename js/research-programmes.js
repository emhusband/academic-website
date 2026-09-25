(() => {
  const NS='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timers=new Map();
  const el=(tag,a={})=>{const n=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>n.setAttribute(k,v));return n};
  const text=(x,y,t,cls='pv-label')=>{const n=el('text',{x,y,class:cls});n.textContent=t;return n};
  const line=(x1,y1,x2,y2,cls='pv-line')=>el('line',{x1,y1,x2,y2,class:cls});
  const circle=(cx,cy,r,cls='pv-node')=>el('circle',{cx,cy,r,class:cls});
  const group=(cls='')=>el('g',{class:cls});
  const svg=()=>el('svg',{viewBox:'0 0 520 360',class:'programme-svg',role:'presentation'});
  const later=(box,fn,ms)=>{const id=setTimeout(fn,ms);if(!timers.has(box))timers.set(box,[]);timers.get(box).push(id)};
  const clear=(box)=>{(timers.get(box)||[]).forEach(clearTimeout);timers.set(box,[])};

  function grammar(box){
    const s=svg();
    // Two identical, rigid grammatical structures. Meaning-bearing symbols move into their terminals.
    const low=group('pv-stage pv-grammar-branch');
    low.append(line(330,205,280,250,'pv-grammar-line'),line(330,205,380,250,'pv-grammar-line'));
    const high=group('pv-stage pv-grammar-branch');
    high.append(line(280,115,230,160,'pv-grammar-line'),line(280,115,330,160,'pv-grammar-line'));
    const P=text(215,290,'P','pv-symbol pv-moving pv-P');
    const x=text(425,285,'x','pv-symbol pv-moving pv-x');
    const ex=text(120,72,'∃','pv-symbol pv-teal pv-moving pv-ex');
    s.append(low,high,P,x,ex);box.append(s);
    const reset=()=>{[low,high,P,x,ex].forEach(n=>n.classList.remove('on','placed'))};
    const cycle=()=>{clear(box);reset();
      later(box,()=>{P.classList.add('on');x.classList.add('on')},350);
      later(box,()=>low.classList.add('on'),1250);
      later(box,()=>{P.classList.add('placed');x.classList.add('placed')},1500);
      later(box,()=>ex.classList.add('on'),3100);
      later(box,()=>high.classList.add('on'),3850);
      later(box,()=>ex.classList.add('placed'),4100);
      later(box,cycle,7900)};
    if(reduced){[low,high,P,x,ex].forEach(n=>n.classList.add('on','placed'))}else cycle();
  }

  function expectation(box){
    const s=svg();s.append(line(45,250,475,250,'pv-axis'));
    const words=[text(80,242,'w₁','pv-word on'),text(205,242,'w₂','pv-word'),text(330,242,'w₃','pv-word'),text(455,242,'w₄','pv-word')];words.forEach(n=>s.append(n));
    const paths=[
      'M128 250 C140 250 148 245 156 230 C164 213 170 181 176 151 C182 181 188 213 196 230 C204 245 212 250 224 250 Z',
      'M252 250 C262 250 269 245 274 228 C280 205 284 166 289 143 C293 170 300 197 311 216 C323 237 339 247 355 250 Z',
      'M376 250 C386 250 393 245 399 229 C405 211 411 184 418 170 C424 188 431 216 440 226 C447 216 454 190 462 179 C469 194 476 223 484 237 C490 246 496 250 503 250 Z'];
    const ds=paths.map(d=>{const g=group('pv-dist');g.append(el('path',{d,class:'pv-dist-fill'}),el('path',{d:d.replace(/ Z$/,''),class:'pv-dist-edge'}));s.append(g);return g});box.append(s);
    let i=0;const reset=()=>{words.slice(1).forEach(w=>w.classList.remove('on'));ds.forEach(d=>d.classList.remove('on'));i=0;ds[0].classList.add('on')};
    const cycle=()=>{clear(box);reset();const step=()=>{const d=ds[i],w=words[i+1];d.classList.remove('on');w.classList.add('on');i++;if(i<ds.length){later(box,()=>ds[i].classList.add('on'),750);later(box,step,3150)}else later(box,cycle,2400)};later(box,step,2700)};
    if(reduced){words.forEach(w=>w.classList.add('on'));ds[2].classList.add('on')}else cycle();
  }

  function alternatives(box){
    const s=svg(),w1=text(205,190,'w₁','pv-word on'),w2=text(405,190,'w₂','pv-word');s.append(w1,w2);
    const pts=[[120,80,18], [205,65,12], [292,105,22], [105,190,10], [285,190,13], [135,285,21], [225,300,11], [310,265,17]];
    const alts=pts.map(([x,y,r],i)=>{const g=group(`pv-alt pv-drift pv-drift-${i%4}`);g.append(line(205,185,x,y,'pv-solid-soft'),circle(x,y,r,i%3===0?'pv-node pv-teal-node':'pv-node'));s.insertBefore(g,w1);return g});
    const links=[[292,105],[285,190],[310,265]].map(([x,y],i)=>{const l=line(405,185,x,y,'pv-coherence pv-grow');l.style.setProperty('--delay',`${i*180}ms`);s.append(l);return l});box.append(s);
    const cycle=()=>{clear(box);alts.forEach(a=>a.classList.remove('on','soft'));links.forEach(l=>l.classList.remove('on'));w2.classList.remove('on');
      alts.forEach((a,i)=>later(box,()=>a.classList.add('on'),550+i*150));
      later(box,()=>w2.classList.add('on'),2850);
      links.forEach((l,i)=>later(box,()=>l.classList.add('on'),3800+i*180));
      later(box,()=>{alts[3].classList.add('soft');alts[6].classList.add('soft')},5200);
      later(box,cycle,8200)};
    if(reduced){alts.forEach(a=>a.classList.add('on'));w2.classList.add('on');links.forEach(l=>l.classList.add('on'))}else cycle();
  }

  function memory(box){
    const s=svg();
    function net(cx,cy,labels,cls){const g=group(cls);const pos=[[0,0],[-43,-43],[45,-38],[-34,48]];pos.forEach(([dx,dy],i)=>{if(i)g.append(line(cx,cy,cx+dx,cy+dy,'pv-memory-line'));g.append(circle(cx+dx,cy+dy,i?13:16,'pv-memory-node'));g.append(text(cx+dx,cy+dy+5,labels[i],'pv-feature'))});return g}
    const old=net(145,190,['f₁','f₂','f₃','f₄'],'pv-memory pv-memory-old');
    const cur=net(390,190,['f₁','f[ ]','f₄','f₅'],'pv-memory pv-memory-current');
    s.append(old,cur);
    const retrieve=el('path',{d:'M 347 147 C 300 102, 235 102, 102 147',class:'pv-retrieve pv-retrieve-wipe'});s.append(retrieve);box.append(s);
    const oldFeatures=old.querySelectorAll('.pv-feature'),oldNodes=old.querySelectorAll('.pv-memory-node');
    const source=oldFeatures[1],sourceNode=oldNodes[1],target=cur.querySelectorAll('.pv-feature')[1];
    const reset=()=>{old.classList.remove('seen','decayed');cur.classList.remove('seen');retrieve.classList.remove('on');source.classList.remove('react');sourceNode.classList.remove('react');target.textContent='f[ ]';target.classList.remove('resolved')};
    const cycle=()=>{clear(box);reset();
      later(box,()=>old.classList.add('seen'),450);
      later(box,()=>old.classList.add('decayed'),2450);
      later(box,()=>cur.classList.add('seen'),3300);
      later(box,()=>retrieve.classList.add('on'),4700);
      later(box,()=>{source.classList.add('react');sourceNode.classList.add('react')},5550);
      later(box,()=>{target.textContent='f₂';target.classList.add('resolved')},6400);
      later(box,cycle,9000)};
    if(reduced){old.classList.add('seen','decayed');cur.classList.add('seen');retrieve.classList.add('on');source.classList.add('react');sourceNode.classList.add('react');target.textContent='f₂';target.classList.add('resolved')}else cycle();
  }

  const makers={'grammatical-structure':grammar,'expectation-inference':expectation,'alternatives-coherence':alternatives,'meaning-memory':memory};
  document.querySelectorAll('.programme-visual').forEach(box=>makers[box.dataset.visual]?.(box));
})();
