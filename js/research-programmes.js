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
    // Identical rigid V-shaped structures. Semantic symbols begin nearby and settle into fixed terminals.
    const high=group('pv-stage pv-grammar-branch pv-upper');
    high.append(line(280,105,230,150,'pv-grammar-line'),line(280,105,330,150,'pv-grammar-line'));
    const low=group('pv-stage pv-grammar-branch pv-lower');
    low.append(line(330,150,280,195,'pv-grammar-line'),line(330,150,380,195,'pv-grammar-line'));
    const P=text(280,220,'P','pv-symbol pv-moving pv-P');
    const x=text(380,220,'x','pv-symbol pv-moving pv-x');
    const ex=text(230,175,'∃','pv-symbol pv-teal pv-moving pv-ex');
    s.append(high,low,P,x,ex);box.append(s);
    const all=[high,low,P,x,ex];
    const reset=()=>all.forEach(n=>n.classList.remove('on','placed','settled'));
    const cycle=()=>{
      clear(box);reset();
      // Loose semantic material is already present, gently floating near its eventual positions.
      later(box,()=>{P.classList.add('on');x.classList.add('on');ex.classList.add('on')},500);
      // P and x settle as the first rigid constituent slowly becomes visible.
      later(box,()=>{low.classList.add('on');P.classList.add('placed');x.classList.add('placed')},2600);
      // The same geometry appears one level higher; existential meaning settles into its terminal.
      later(box,()=>{high.classList.add('on');ex.classList.add('placed')},6100);
      later(box,()=>all.forEach(n=>n.classList.add('settled')),9000);
      // Dissolve structure first; symbols then loosen only slightly before the loop restarts.
      later(box,()=>{high.classList.remove('on');low.classList.remove('on')},12600);
      later(box,()=>{P.classList.remove('placed');x.classList.remove('placed');ex.classList.remove('placed')},14200);
      later(box,cycle,17200);
    };
    if(reduced){all.forEach(n=>n.classList.add('on','placed','settled'))}else cycle();
  }

  function expectation(box){
    const s=svg();s.append(line(45,250,475,250,'pv-axis'));
    const words=[text(80,242,'w₁','pv-word on'),text(205,242,'w₂','pv-word'),text(330,242,'w₃','pv-word'),text(455,242,'w₄','pv-word')];words.forEach(n=>s.append(n));
    const paths=[
      'M128 250 C140 250 148 245 156 230 C164 213 170 181 176 151 C182 181 188 213 196 230 C204 245 212 250 224 250 Z',
      'M252 250 C262 250 269 245 274 228 C280 205 284 166 289 143 C293 170 300 197 311 216 C323 237 339 247 355 250 Z',
      'M376 250 C386 250 393 245 399 229 C405 211 411 184 418 170 C424 188 431 216 440 226 C447 216 454 190 462 179 C469 194 476 223 484 237 C490 246 496 250 503 250 Z'];
    const ds=paths.map((d,i)=>{const g=group(`pv-dist pv-breathe pv-breathe-${i}`);g.append(el('path',{d,class:'pv-dist-fill'}),el('path',{d:d.replace(/ Z$/,''),class:'pv-dist-edge'}));s.append(g);return g});box.append(s);
    const reset=()=>{words.slice(1).forEach(w=>w.classList.remove('on'));ds.forEach(d=>d.classList.remove('on'));ds[0].classList.add('on')};
    const cycle=()=>{clear(box);reset();
      later(box,()=>{ds[0].classList.remove('on');words[1].classList.add('on')},3600);
      later(box,()=>ds[1].classList.add('on'),5200);
      later(box,()=>{ds[1].classList.remove('on');words[2].classList.add('on')},8800);
      later(box,()=>ds[2].classList.add('on'),10400);
      later(box,()=>{ds[2].classList.remove('on');words[3].classList.add('on')},14000);
      later(box,cycle,17800)};
    if(reduced){words.forEach(w=>w.classList.add('on'));ds[2].classList.add('on')}else cycle();
  }

  function alternatives(box){
    const s=svg(),w1=text(205,190,'w₁','pv-word on'),w2=text(405,190,'w₂','pv-word');s.append(w1,w2);
    const pts=[[120,80,18],[205,65,12],[292,105,22],[105,190,10],[285,190,13],[135,285,21],[225,300,11],[310,265,17]];
    const alts=pts.map(([x,y,r],i)=>{const g=group(`pv-alt pv-drift pv-drift-${i%4}`);g.append(line(205,185,x,y,'pv-solid-soft'),circle(x,y,r,i%3===0?'pv-node pv-teal-node':'pv-node'));s.insertBefore(g,w1);return g});
    const links=[[292,105],[285,190],[310,265]].map(([x,y],i)=>{const l=line(405,185,x,y,'pv-coherence pv-grow');l.style.setProperty('--delay',`${i*260}ms`);s.append(l);return l});box.append(s);
    const cycle=()=>{clear(box);alts.forEach(a=>a.classList.remove('on','soft'));links.forEach(l=>l.classList.remove('on'));w2.classList.remove('on');
      alts.forEach((a,i)=>later(box,()=>a.classList.add('on'),700+i*330));
      later(box,()=>{alts[3].classList.add('soft');alts[6].classList.add('soft')},5400);
      later(box,()=>w2.classList.add('on'),6900);
      links.forEach((l,i)=>later(box,()=>l.classList.add('on'),8900+i*420));
      later(box,()=>{alts[1].classList.add('soft');alts[5].classList.add('soft')},12400);
      later(box,()=>{links.forEach(l=>l.classList.remove('on'));w2.classList.remove('on');alts.forEach(a=>a.classList.remove('on'))},15800);
      later(box,cycle,18400)};
    if(reduced){alts.forEach(a=>a.classList.add('on'));w2.classList.add('on');links.forEach(l=>l.classList.add('on'))}else cycle();
  }

  function memory(box){
    const s=svg();
    // Two compact bound feature structures: an older trace and a current representation.
    function pair(cx,cy,leftLabel,rightLabel,cls){
      const g=group(cls);
      g.append(line(cx-28,cy,cx+28,cy,'pv-memory-line'));
      g.append(circle(cx-34,cy,16,'pv-memory-node'),circle(cx+34,cy,16,'pv-memory-node'));
      g.append(text(cx-34,cy+5,leftLabel,'pv-feature'),text(cx+34,cy+5,rightLabel,'pv-feature'));
      return g;
    }
    const old=pair(145,190,'f₁','f₂','pv-memory pv-memory-old');
    const cur=pair(390,190,'f₃','f[ ]','pv-memory pv-memory-current');
    s.append(old,cur);
    // Wipes from the current unvalued feature back toward the relevant old feature.
    const retrieve=el('path',{d:'M 424 190 C 350 128, 265 128, 179 190',class:'pv-retrieve pv-retrieve-wipe'});s.append(retrieve);box.append(s);
    const oldFeatures=old.querySelectorAll('.pv-feature'),oldNodes=old.querySelectorAll('.pv-memory-node');
    const curFeatures=cur.querySelectorAll('.pv-feature');
    const source=oldFeatures[1],sourceNode=oldNodes[1],target=curFeatures[1];
    const reset=()=>{old.classList.remove('seen','decayed');cur.classList.remove('seen');retrieve.classList.remove('on');source.classList.remove('react');sourceNode.classList.remove('react');target.textContent='f[ ]';target.classList.remove('resolved')};
    const cycle=()=>{clear(box);reset();
      later(box,()=>old.classList.add('seen'),700);
      later(box,()=>old.classList.add('decayed'),4300);
      later(box,()=>cur.classList.add('seen'),6500);
      later(box,()=>retrieve.classList.add('on'),9300);
      later(box,()=>{source.classList.add('react');sourceNode.classList.add('react')},11200);
      later(box,()=>{target.textContent='f₂';target.classList.add('resolved')},13200);
      later(box,()=>{retrieve.classList.remove('on');cur.classList.remove('seen');old.classList.remove('seen')},16000);
      later(box,cycle,18600)};
    if(reduced){old.classList.add('seen','decayed');cur.classList.add('seen');retrieve.classList.add('on');source.classList.add('react');sourceNode.classList.add('react');target.textContent='f₂';target.classList.add('resolved')}else cycle();
  }

  const makers={'grammatical-structure':grammar,'expectation-inference':expectation,'alternatives-coherence':alternatives,'meaning-memory':memory};
  document.querySelectorAll('.programme-visual').forEach(box=>makers[box.dataset.visual]?.(box));
})();
