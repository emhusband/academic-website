(() => {
  const NS='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timers=new Map();
  const visible=new WeakMap();
  const E=(tag,a={})=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(a))n.setAttribute(k,v);return n};
  const G=(cls='')=>E('g',{class:cls});
  const T=(x,y,t,cls='r24-label')=>{const n=E('text',{x,y,class:cls});n.textContent=t;return n};
  const L=(x1,y1,x2,y2,cls='r24-line')=>E('line',{x1,y1,x2,y2,class:cls});
  const C=(cx,cy,r,cls='r24-node')=>E('circle',{cx,cy,r,class:cls});
  const S=()=>E('svg',{viewBox:'0 0 520 360',class:'r24-svg',role:'presentation'});
  const later=(box,fn,ms)=>{const id=setTimeout(()=>{if(visible.get(box)!==false)fn()},ms);(timers.get(box)||timers.set(box,[]).get(box)).push(id)};
  const clear=(box)=>{(timers.get(box)||[]).forEach(clearTimeout);timers.set(box,[])};
  const fadeScene=(scene,on)=>scene.classList.toggle('r24-scene-on',on);

  function grammar(box){
    const s=S(), scene=G('r24-scene'); s.append(scene); box.append(s);
    // Two identical rigid Vs. The lower constituent's apex is the right terminal of the upper V.
    const lower=G('r24-structure r24-lower');
    lower.append(L(330,176,285,216,'r24-branch'),L(330,176,375,216,'r24-branch'));
    const upper=G('r24-structure r24-upper');
    upper.append(L(285,116,240,156,'r24-branch'),L(285,116,330,156,'r24-branch'));
    scene.append(lower,upper);

    // Relevant semantic material starts visibly displaced from its terminals.
    const P=T(285,223,'P','r24-symbol r24-relevant r24-P');
    const x=T(375,223,'x','r24-symbol r24-relevant r24-x');
    const ex=T(240,163,'∃','r24-symbol r24-relevant r24-ex');
    // Distractors make the field genuinely underdetermined before structure asserts itself.
    const distractors=[
      T(118,102,'∀','r24-symbol r24-distractor r24-float-a'),
      T(430,88,'e','r24-symbol r24-distractor r24-float-b'),
      T(104,260,'s','r24-symbol r24-distractor r24-float-c'),
      T(438,265,'Q','r24-symbol r24-distractor r24-float-d'),
      T(340,70,'Op','r24-symbol r24-distractor r24-float-e')
    ];
    scene.append(...distractors,P,x,ex);
    const allSymbols=[...distractors,P,x,ex];

    const reset=()=>{
      fadeScene(scene,false); lower.classList.remove('on'); upper.classList.remove('on');
      allSymbols.forEach(n=>n.classList.remove('on','placed','dim'));
    };
    const cycle=()=>{
      clear(box); reset();
      later(box,()=>{fadeScene(scene,true);allSymbols.forEach(n=>n.classList.add('on'))},350);
      // Lower structure asserts itself; P/x are pulled slowly inward while irrelevant material begins to recede.
      later(box,()=>{lower.classList.add('on');P.classList.add('placed');x.classList.add('placed');distractors[0].classList.add('dim');distractors[2].classList.add('dim')},3900);
      later(box,()=>{upper.classList.add('on');ex.classList.add('placed');distractors.forEach(n=>n.classList.add('dim'))},8200);
      // Hold the completed composition.
      later(box,()=>fadeScene(scene,false),14500);
      later(box,cycle,17800);
    };
    if(reduced){fadeScene(scene,true);allSymbols.forEach(n=>n.classList.add('on'));distractors.forEach(n=>n.classList.add('dim'));lower.classList.add('on');upper.classList.add('on');P.classList.add('placed');x.classList.add('placed');ex.classList.add('placed')} else cycle();
  }

  function expectation(box){
    const s=S(),scene=G('r24-scene');s.append(scene);box.append(s);
    scene.append(L(48,250,472,250,'r24-axis'));
    const words=[T(76,242,'w₁','r24-word on'),T(200,242,'w₂','r24-word'),T(324,242,'w₃','r24-word'),T(448,242,'w₄','r24-word')];scene.append(...words);
    const paths=[
      'M126 250 C139 250 148 245 156 229 C164 211 170 178 176 148 C182 178 188 211 196 229 C204 245 213 250 226 250 Z',
      'M250 250 C260 250 267 245 273 227 C279 203 283 163 288 140 C293 170 300 198 311 217 C323 238 340 248 358 250 Z',
      'M374 250 C384 250 391 245 397 228 C403 209 409 181 416 167 C423 186 430 215 439 225 C446 214 453 187 461 176 C468 192 475 222 484 236 C490 246 497 250 505 250 Z'];
    const ds=paths.map((d,i)=>{const g=G(`r24-dist r24-dist-${i}`);g.append(E('path',{d,class:'r24-dist-fill'}),E('path',{d:d.replace(/ Z$/,''),class:'r24-dist-edge'}));scene.append(g);return g});
    const reset=()=>{fadeScene(scene,false);words.slice(1).forEach(w=>w.classList.remove('on'));ds.forEach(d=>d.classList.remove('on'))};
    const cycle=()=>{
      clear(box);reset();
      later(box,()=>{fadeScene(scene,true);ds[0].classList.add('on')},500);
      // Long emergence, dwell, and cross-fade: no distribution pops.
      later(box,()=>{ds[0].classList.remove('on');words[1].classList.add('on')},6100);
      later(box,()=>ds[1].classList.add('on'),8200);
      later(box,()=>{ds[1].classList.remove('on');words[2].classList.add('on')},13700);
      later(box,()=>ds[2].classList.add('on'),15800);
      later(box,()=>{ds[2].classList.remove('on');words[3].classList.add('on')},21300);
      later(box,()=>fadeScene(scene,false),24300);
      later(box,cycle,27800);
    };
    if(reduced){fadeScene(scene,true);words.forEach(w=>w.classList.add('on'));ds[2].classList.add('on')} else cycle();
  }

  function alternatives(box){
    const s=S(),scene=G('r24-scene');s.append(scene);box.append(s);
    const w1=T(205,188,'w₁','r24-word on'),w2=T(405,188,'w₂','r24-word');scene.append(w1,w2);
    const pts=[[112,84,17],[205,66,12],[298,102,22],[105,188,10],[292,188,14],[132,282,20],[225,298,11],[310,266,17]];
    const alts=pts.map(([x,y,r],i)=>{const g=G(`r24-alt r24-alt-${i}`);g.append(L(205,183,x,y,'r24-alt-line'),C(x,y,r,i%3===0?'r24-node r24-teal-node':'r24-node'));scene.insertBefore(g,w1);return g});
    const links=[[298,102],[292,188],[310,266]].map(([x,y])=>{const p=E('path',{d:`M405 183 C360 170 ${x+20} ${y-8} ${x} ${y}`,class:'r24-coherence'});scene.append(p);return p});
    const reset=()=>{fadeScene(scene,false);alts.forEach(a=>a.classList.remove('on','soft'));w2.classList.remove('on');links.forEach(l=>l.classList.remove('on'))};
    const cycle=()=>{
      clear(box);reset();
      later(box,()=>fadeScene(scene,true),400);
      // Alternatives emerge as one radial field rather than as a list.
      later(box,()=>alts.forEach(a=>a.classList.add('on')),1700);
      later(box,()=>{alts[1].classList.add('soft');alts[3].classList.add('soft');alts[6].classList.add('soft')},7200);
      later(box,()=>w2.classList.add('on'),9600);
      later(box,()=>links.forEach(l=>l.classList.add('on')),12100);
      later(box,()=>{alts[5].classList.add('soft');alts[0].classList.add('soft')},15700);
      later(box,()=>fadeScene(scene,false),19000);
      later(box,cycle,22500);
    };
    if(reduced){fadeScene(scene,true);alts.forEach(a=>a.classList.add('on'));w2.classList.add('on');links.forEach(l=>l.classList.add('on'))} else cycle();
  }

  function memory(box){
    const s=S(),scene=G('r24-scene');s.append(scene);box.append(s);
    function bundle(cx,cy,labels,cls){
      const g=G(`r24-bundle ${cls}`), pts=[[cx-34,cy-30],[cx+34,cy-30],[cx-34,cy+30],[cx+34,cy+30]];
      g.append(L(pts[0][0],pts[0][1],pts[1][0],pts[1][1],'r24-memory-line'),L(pts[0][0],pts[0][1],pts[2][0],pts[2][1],'r24-memory-line'),L(pts[1][0],pts[1][1],pts[3][0],pts[3][1],'r24-memory-line'),L(pts[2][0],pts[2][1],pts[3][0],pts[3][1],'r24-memory-line'));
      pts.forEach(([x,y],i)=>{g.append(C(x,y,15,`r24-memory-node node-${i}`),T(x,y+5,labels[i],`r24-feature feature-${i}`))});
      return g;
    }
    const old=bundle(145,185,['f₁','f₂','f₃','f₄'],'r24-old');
    const cur=bundle(390,185,['f₅','f₆','f₇','f_'],'r24-current');
    scene.append(old,cur);
    // Current bottom-right feature retrieves old top-right f2.
    const retrieve=E('path',{d:'M424 215 C355 285 270 275 179 155',class:'r24-retrieve'});scene.append(retrieve);
    const sourceNode=old.querySelector('.node-1'),sourceLabel=old.querySelector('.feature-1'),target=cur.querySelector('.feature-3');
    const reset=()=>{fadeScene(scene,false);old.classList.remove('seen','decayed');cur.classList.remove('seen');retrieve.classList.remove('on');sourceNode.classList.remove('react');sourceLabel.classList.remove('react');target.classList.remove('resolved');target.textContent='f_'};
    const cycle=()=>{
      clear(box);reset();
      later(box,()=>fadeScene(scene,true),400);
      later(box,()=>old.classList.add('seen'),1000);
      later(box,()=>old.classList.add('decayed'),6500);
      later(box,()=>cur.classList.add('seen'),9000);
      later(box,()=>retrieve.classList.add('on'),12500);
      later(box,()=>{sourceNode.classList.add('react');sourceLabel.classList.add('react')},15700);
      later(box,()=>{target.textContent='f₂';target.classList.add('resolved')},18000);
      later(box,()=>fadeScene(scene,false),21500);
      later(box,cycle,25000);
    };
    if(reduced){fadeScene(scene,true);old.classList.add('seen','decayed');cur.classList.add('seen');retrieve.classList.add('on');sourceNode.classList.add('react');sourceLabel.classList.add('react');target.textContent='f₂';target.classList.add('resolved')} else cycle();
  }

  const makers={'grammatical-structure':grammar,'expectation-inference':expectation,'alternatives-coherence':alternatives,'meaning-memory':memory};
  const boxes=[...document.querySelectorAll('.programme-visual')];
  boxes.forEach(box=>{visible.set(box,true);makers[box.dataset.visual]?.(box)});
  if('IntersectionObserver' in window && !reduced){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>visible.set(e.target,e.isIntersecting)),{rootMargin:'150px'});
    boxes.forEach(b=>io.observe(b));
  }
})();
