(() => {
  const NS='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timers=new Map();
  const el=(tag,a={})=>{const n=document.createElementNS(NS,tag);Object.entries(a).forEach(([k,v])=>n.setAttribute(k,v));return n};
  const text=(x,y,t,cls='pv-label')=>{const n=el('text',{x,y,class:cls});n.textContent=t;return n};
  const line=(x1,y1,x2,y2,cls='pv-line')=>el('line',{x1,y1,x2,y2,class:cls});
  const circle=(cx,cy,r,cls='pv-node')=>el('circle',{cx,cy,r,class:cls});
  const group=(cls='')=>el('g',{class:cls});
  const svg=()=>el('svg',{viewBox:'0 0 520 360',class:'programme-svg pv-cycle',role:'presentation'});
  const later=(box,fn,ms)=>{const id=setTimeout(fn,ms);if(!timers.has(box))timers.set(box,[]);timers.get(box).push(id)};
  const clear=(box)=>{(timers.get(box)||[]).forEach(clearTimeout);timers.set(box,[])};
  const begin=(s)=>requestAnimationFrame(()=>s.classList.add('pv-cycle-visible'));
  const dissolve=(s)=>s.classList.remove('pv-cycle-visible');

  function grammar(box){
    const s=svg();
    // Two rigid, identical Vs. A richer field of semantic material floats before structure selects from it.
    const upper=group('pv-structure-stage pv-upper');
    upper.append(line(280,112,230,157,'pv-grammar-line'),line(280,112,330,157,'pv-grammar-line'));
    const lower=group('pv-structure-stage pv-lower');
    lower.append(line(330,157,280,202,'pv-grammar-line'),line(330,157,380,202,'pv-grammar-line'));

    const symbols=[
      ['P',280,202,-58,38,'pv-P'],['x',380,202,52,31,'pv-x'],['∃',230,157,-46,-28,'pv-ex pv-teal'],
      ['∀',116,100,0,0,'pv-unused'],['e',425,92,0,0,'pv-unused'],['s',92,246,0,0,'pv-unused'],
      ['Q',436,264,0,0,'pv-unused'],['Op',340,64,0,0,'pv-unused pv-op']
    ].map(([t,x,y,dx,dy,cls])=>{const n=text(x,y,t,`pv-symbol pv-logic ${cls}`);n.style.setProperty('--dx',`${dx}px`);n.style.setProperty('--dy',`${dy}px`);s.append(n);return n});
    const [P,x,ex,...unused]=symbols;
    s.append(upper,lower); box.append(s);
    const reset=()=>{symbols.forEach(n=>n.classList.remove('on','placed','soft'));upper.classList.remove('on');lower.classList.remove('on')};
    const cycle=()=>{clear(box);dissolve(s);reset();
      later(box,()=>{begin(s);symbols.forEach(n=>n.classList.add('on'))},900);
      later(box,()=>{lower.classList.add('on');P.classList.add('placed');x.classList.add('placed')},4300);
      later(box,()=>unused.forEach(n=>n.classList.add('soft')),6500);
      later(box,()=>{upper.classList.add('on');ex.classList.add('placed')},7900);
      later(box,()=>dissolve(s),13900);
      later(box,cycle,17100);
    };
    if(reduced){begin(s);symbols.forEach(n=>n.classList.add('on'));P.classList.add('placed');x.classList.add('placed');ex.classList.add('placed');unused.forEach(n=>n.classList.add('soft'));upper.classList.add('on');lower.classList.add('on')} else cycle();
  }

  function expectation(box){
    const s=svg(); s.append(line(45,250,475,250,'pv-axis'));
    const words=[text(80,242,'w₁','pv-word on'),text(205,242,'w₂','pv-word'),text(330,242,'w₃','pv-word'),text(455,242,'w₄','pv-word')]; words.forEach(n=>s.append(n));
    const paths=[
      'M128 250 C140 250 148 245 156 230 C164 213 170 181 176 151 C182 181 188 213 196 230 C204 245 212 250 224 250 Z',
      'M252 250 C262 250 269 245 274 228 C280 205 284 166 289 143 C293 170 300 197 311 216 C323 237 339 247 355 250 Z',
      'M376 250 C386 250 393 245 399 229 C405 211 411 184 418 170 C424 188 431 216 440 226 C447 216 454 190 462 179 C469 194 476 223 484 237 C490 246 496 250 503 250 Z'];
    const ds=paths.map((d,i)=>{const g=group(`pv-dist pv-breathe pv-breathe-${i}`);g.append(el('path',{d,class:'pv-dist-fill'}),el('path',{d:d.replace(/ Z$/,''),class:'pv-dist-edge'}));s.append(g);return g}); box.append(s);
    const reset=()=>{words.slice(1).forEach(w=>w.classList.remove('on'));ds.forEach(d=>d.classList.remove('on'))};
    const cycle=()=>{clear(box);dissolve(s);reset();
      later(box,()=>{begin(s);ds[0].classList.add('on')},900);
      later(box,()=>{ds[0].classList.remove('on');words[1].classList.add('on')},5600);
      later(box,()=>ds[1].classList.add('on'),7600);
      later(box,()=>{ds[1].classList.remove('on');words[2].classList.add('on')},12300);
      later(box,()=>ds[2].classList.add('on'),14300);
      later(box,()=>{ds[2].classList.remove('on');words[3].classList.add('on')},19000);
      later(box,()=>dissolve(s),22300);
      later(box,cycle,25600);
    };
    if(reduced){begin(s);words.forEach(w=>w.classList.add('on'));ds[2].classList.add('on')} else cycle();
  }

  function alternatives(box){
    const s=svg(), w1=text(205,190,'w₁','pv-word on'), w2=text(405,190,'w₂','pv-word'); s.append(w1,w2);
    const pts=[[120,80,18],[205,65,12],[292,105,22],[105,190,10],[285,190,13],[135,285,21],[225,300,11],[310,265,17]];
    const alts=pts.map(([x,y,r],i)=>{const g=group(`pv-alt pv-radial pv-drift-${i%4}`);g.style.setProperty('--from-x',`${205-x}px`);g.style.setProperty('--from-y',`${190-y}px`);g.append(line(205,185,x,y,'pv-solid-soft'),circle(x,y,r,i%3===0?'pv-node pv-teal-node':'pv-node'));s.insertBefore(g,w1);return g});
    const links=[[292,105],[285,190],[310,265]].map(([x,y],i)=>{const l=line(405,185,x,y,'pv-coherence pv-grow');l.style.setProperty('--delay',`${i*240}ms`);s.append(l);return l}); box.append(s);
    const reset=()=>{alts.forEach(a=>a.classList.remove('on','soft'));links.forEach(l=>l.classList.remove('on'));w2.classList.remove('on')};
    const cycle=()=>{clear(box);dissolve(s);reset();
      later(box,()=>begin(s),900);
      later(box,()=>alts.forEach(a=>a.classList.add('on')),1900);
      later(box,()=>{alts[1].classList.add('soft');alts[3].classList.add('soft');alts[6].classList.add('soft')},7200);
      later(box,()=>w2.classList.add('on'),9300);
      later(box,()=>links.forEach(l=>l.classList.add('on')),11700);
      later(box,()=>{alts[5].classList.add('soft');alts[7].classList.add('soft')},14900);
      later(box,()=>dissolve(s),18100);
      later(box,cycle,21400);
    };
    if(reduced){begin(s);alts.forEach(a=>a.classList.add('on'));w2.classList.add('on');links.forEach(l=>l.classList.add('on'))} else cycle();
  }

  function memory(box){
    const s=svg();
    function bundle(cx,cy,labels,cls){
      const g=group(cls), pts=[[-38,-30],[38,-30],[-38,30],[38,30]];
      g.append(line(cx-38,cy-30,cx+38,cy-30,'pv-memory-line'),line(cx-38,cy+30,cx+38,cy+30,'pv-memory-line'),line(cx-38,cy-30,cx-38,cy+30,'pv-memory-line'),line(cx+38,cy-30,cx+38,cy+30,'pv-memory-line'),line(cx-38,cy-30,cx+38,cy+30,'pv-memory-line'));
      pts.forEach(([dx,dy],i)=>{g.append(circle(cx+dx,cy+dy,15,'pv-memory-node'));g.append(text(cx+dx,cy+dy+5,labels[i],'pv-feature'))});
      return g;
    }
    const old=bundle(145,190,['f₁','f₂','f₃','f₄'],'pv-memory pv-memory-old');
    const cur=bundle(390,190,['f₅','f₆','f₇','f_'],'pv-memory pv-memory-current');
    s.append(old,cur);
    const retrieve=el('path',{d:'M 428 220 C 350 278, 270 276, 183 160',class:'pv-retrieve pv-retrieve-wipe'}); s.append(retrieve); box.append(s);
    const oldFeatures=old.querySelectorAll('.pv-feature'), oldNodes=old.querySelectorAll('.pv-memory-node'), target=cur.querySelectorAll('.pv-feature')[3];
    const source=oldFeatures[1], sourceNode=oldNodes[1];
    const reset=()=>{old.classList.remove('seen','decayed');cur.classList.remove('seen');retrieve.classList.remove('on');source.classList.remove('react');sourceNode.classList.remove('react');target.textContent='f_';target.classList.remove('resolved')};
    const cycle=()=>{clear(box);dissolve(s);reset();
      later(box,()=>{begin(s);old.classList.add('seen')},900);
      later(box,()=>old.classList.add('decayed'),6000);
      later(box,()=>cur.classList.add('seen'),8200);
      later(box,()=>retrieve.classList.add('on'),11600);
      later(box,()=>{source.classList.add('react');sourceNode.classList.add('react')},14500);
      later(box,()=>{target.textContent='f₂';target.classList.add('resolved')},16600);
      later(box,()=>dissolve(s),19800);
      later(box,cycle,23100);
    };
    if(reduced){begin(s);old.classList.add('seen','decayed');cur.classList.add('seen');retrieve.classList.add('on');source.classList.add('react');sourceNode.classList.add('react');target.textContent='f₂';target.classList.add('resolved')} else cycle();
  }

  const makers={'grammatical-structure':grammar,'expectation-inference':expectation,'alternatives-coherence':alternatives,'meaning-memory':memory};
  document.querySelectorAll('.programme-visual').forEach(box=>makers[box.dataset.visual]?.(box));
})();
