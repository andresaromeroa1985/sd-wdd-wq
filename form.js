var STEPS=6,cur=1,needNewDomain=false,featCount=3,lang='en';
function $(id){return document.getElementById(id);}
function on(el,evt,fn){if(el)el.addEventListener(evt,fn);}
function tog(id,v){var el=$(id);if(el)el.classList.toggle('on',!!v);}
function show(id){tog(id,true);}
function hide(id){tog(id,false);}
function selRG(gId,inp){var g=$(gId);if(!g)return;g.querySelectorAll('.ro').forEach(function(o){o.classList.remove('sel');});if(inp)inp.closest('.ro').classList.add('sel');}

var SM={
  en:[
    {l:'Business info',s:'Name, address, about us'},
    {l:'Your domain',s:'Existing site, domain setup'},
    {l:'Your brand',s:'Logo, colors, look & feel'},
    {l:'Pages & content',s:'Pages, images, features'},
    {l:'Integrations',s:'Social, third-party'},
    {l:'Final details',s:'Publishing, notes, T&C'}
  ],
  es:[
    {l:'Informaci\u00f3n del negocio',s:'Nombre, direcci\u00f3n, sobre nosotros'},
    {l:'Su dominio',s:'Sitio existente, configuraci\u00f3n'},
    {l:'Su marca',s:'Logo, colores, estilo'},
    {l:'P\u00e1ginas y contenido',s:'P\u00e1ginas, im\u00e1genes, funciones'},
    {l:'Integraciones',s:'Redes sociales, terceros'},
    {l:'Detalles finales',s:'Publicaci\u00f3n, notas, T&C'}
  ]
};

var T={
  en:{
    topbarLabel:'Website questionnaire',
    eyebrow:'Website services',
    titleMain:"Let's build your",
    titleSpan:'website',
    sub:"Tell us about your business and we'll take it from there. Takes about 5 minutes.",
    sbSteps:'Steps',
    helpTitle:'Need help?',
    helpBody:'Have questions about your website? Reach out to our team.',
    helpEmail:'Email us',
    helpCall:'Book a call',
    pgCounter:function(n){return n+' of 6 included pages selected';},
    pgCounterOver:function(n,e,c){return n+' pages \u2014 '+e+' additional page'+(e>1?'s':'')+' at $50 each';},
    extraPagesMsg:function(e,c){return e+' additional page'+(e>1?'s':'')+' selected ($'+c+' USD total). ';},
    extraPagesBody:"By continuing, you agree to the additional page fee. We'll send you a proposal to review and sign before any work begins.",
    featCounter:function(n){return n+' of 6 slots used';},
    imagesDisclaimer:"By selecting your own images, you declare you have copyright licensing for the imagery or authorize its use on your website.\n\nIf we don't receive images at time of processing, we'll use stock images and replace them later.",
    inspirationDesc:'You can also upload a flyer, poster, or social media post using the link below.\n<a href="https://spoton-website-contents.tiiny.site/" target="_blank" style="color:var(--blue);font-weight:500">Upload inspiration files \u2197</a>\n\nTo view example websites made by us, <a href="https://websites-catalog.webflow.io/client-catalog" target="_blank" style="color:var(--blue);font-weight:500">click here \u2197</a>',
    pageSpecificsHint:'Please tell us: which page, what content, and any external links (Yelp, TripAdvisor, reservations, press, etc.)<br><em>Example: Home \u2014 Include: About us, Featured dishes, Menu, Catering, Newsletter, Contact</em>',
    autopublishDesc:"Once your website draft is complete, our team will reach out to you at least 5 times to get your approval. If we're unable to reach you, your website will be auto-published to your domain so it can start ranking in Google's search engines.<br><br>If you prefer not to auto-publish, your subscription will simply be put on hold until you get back to us.",
    back:'\u2190 Back',
    cont:'Continue',
    submit:'Submit questionnaire',
    inspirationNudgeTitle:"No inspiration site?",
    inspirationNudgeBody:"That's totally fine — but we'd love for you to browse our website examples so our team has a better sense of your style.",
    inspirationNudgeCta:"View our website examples \u2197",
    inspirationNudgeContinue:"Continue without one",
    inspirationErr:"Please share an inspiration site or URL — or visit our examples and describe a style you like."
  },
  es:{
    topbarLabel:'Cuestionario de sitio web',
    eyebrow:'Servicios web',
    titleMain:'Vamos a construir su',
    titleSpan:'sitio web',
    sub:'Cu\u00e9ntenos sobre su negocio y nos encargamos del resto. Toma unos 5 minutos.',
    sbSteps:'Pasos',
    helpTitle:'\u00bfNecesita ayuda?',
    helpBody:'\u00bfTiene preguntas sobre su sitio web? Comun\u00edquese con nuestro equipo.',
    helpEmail:'Enviar correo',
    helpCall:'Agendar llamada',
    pgCounter:function(n){return n+' de 6 p\u00e1ginas incluidas seleccionadas';},
    pgCounterOver:function(n,e,c){return n+' p\u00e1ginas \u2014 '+e+' p\u00e1gina'+(e>1?'s':'')+' adicional'+(e>1?'es':'')+' a $50 cada una';},
    extraPagesMsg:function(e,c){return e+' p\u00e1gina'+(e>1?'s adicionales':' adicional')+' seleccionada'+(e>1?'s':'')+' ($'+c+' USD total). ';},
    extraPagesBody:'Al continuar, acepta el costo adicional por p\u00e1gina. Le enviaremos una propuesta para revisar y firmar antes de comenzar.',
    featCounter:function(n){return n+' de 6 espacios usados';},
    imagesDisclaimer:'Al seleccionar sus propias im\u00e1genes, declara que tiene licencia de derechos de autor sobre ellas o autoriza su uso en su sitio web.\n\nSi no recibimos im\u00e1genes al momento de procesar, usaremos im\u00e1genes de banco y las reemplazaremos despu\u00e9s.',
    inspirationDesc:'Tambi\u00e9n puede subir un volante, p\u00f3ster o publicaci\u00f3n de redes sociales usando el enlace a continuaci\u00f3n.\n<a href="https://spoton-website-contents.tiiny.site/" target="_blank" style="color:var(--blue);font-weight:500">Subir archivos de inspiraci\u00f3n \u2197</a>\n\nPara ver ejemplos de sitios web hechos por nosotros, <a href="https://websites-catalog.webflow.io/client-catalog" target="_blank" style="color:var(--blue);font-weight:500">haga clic aqu\u00ed \u2197</a>',
    pageSpecificsHint:'Por favor ind\u00edquenos: qu\u00e9 p\u00e1gina, qu\u00e9 contenido, y cualquier enlace externo (Yelp, TripAdvisor, reservaciones, prensa, etc.)<br><em>Ejemplo: Inicio \u2014 Incluir: Sobre nosotros, Platillos destacados, Men\u00fa, Catering, Newsletter, Contacto</em>',
    autopublishDesc:'Una vez que el borrador de su sitio web est\u00e9 listo, nuestro equipo lo contactar\u00e1 al menos 5 veces para obtener su aprobaci\u00f3n. Si no podemos comunicarnos con usted, su sitio web se publicar\u00e1 autom\u00e1ticamente para que comience a posicionarse en Google.<br><br>Si prefiere que no se publique autom\u00e1ticamente, su suscripci\u00f3n simplemente se pausar\u00e1 hasta que se comunique con nosotros.',
    back:'\u2190 Atr\u00e1s',
    cont:'Continuar',
    submit:'Enviar cuestionario',
    inspirationNudgeTitle:"¿No tiene sitio de inspiración?",
    inspirationNudgeBody:"No hay problema — pero le recomendamos explorar nuestros ejemplos de sitios web para que nuestro equipo tenga una mejor idea de su estilo.",
    inspirationNudgeCta:"Ver nuestros ejemplos de sitios web \u2197",
    inspirationNudgeContinue:"Continuar sin uno",
    inspirationErr:"Por favor comparta un sitio de inspiración o URL — o visite nuestros ejemplos y describa un estilo que le guste."
  }
};

function t(key){return T[lang][key]||T['en'][key]||'';}

// Tracks whether the user dismissed the inspiration nudge dialog
var inspirationNudgeDismissed = false;

function applyLang(){
  document.querySelectorAll('[data-en]').forEach(function(el){
    el.innerHTML=el.getAttribute('data-'+lang)||el.getAttribute('data-en')||'';
  });
  document.querySelectorAll('[data-en-ph]').forEach(function(el){
    el.placeholder=el.getAttribute('data-'+lang+'-ph')||el.getAttribute('data-en-ph')||'';
  });
  $('topbar-label').textContent=t('topbarLabel');
  $('ph-eyebrow').textContent=t('eyebrow');
  $('ph-title').innerHTML=t('titleMain')+' <span id="ph-title-span">'+t('titleSpan')+'</span>';
  $('ph-sub').textContent=t('sub');
  $('sb-steps-title').textContent=t('sbSteps');
  $('help-title').textContent=t('helpTitle');
  $('help-body').textContent=t('helpBody');
  $('help-email').innerHTML=t('helpEmail')+' <svg viewBox="0 0 12 12"><path d="M2 10L10 2M10 2H5M10 2v5" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" fill="none" stroke-width="2"/></svg>';
  $('help-call').innerHTML=t('helpCall')+' <svg viewBox="0 0 12 12"><path d="M2 10L10 2M10 2H5M10 2v5" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" fill="none" stroke-width="2"/></svg>';
  $('inspiration-desc').innerHTML=t('inspirationDesc').replace(/\n/g,'<br>');
  $('images-disclaimer').innerHTML=t('imagesDisclaimer').replace(/\n/g,'<br>');
  $('page-specifics-hint').innerHTML=t('pageSpecificsHint');
  $('autopublish-desc').innerHTML=t('autopublishDesc');
  $('extra-pages-body').textContent=t('extraPagesBody');
  updFeatCounter();
  updPgCounter();
  updProg();
}

function setLang(l){
  lang=l;
  $('btn-en').classList.toggle('active',l==='en');
  $('btn-es').classList.toggle('active',l==='es');
  applyLang();
  sendHeight();
}

function updProg(){
  var dots=$('dots');dots.innerHTML='';
  for(var i=1;i<=STEPS;i++){
    var d=document.createElement('div');
    var isDone=i<cur,isAct=i===cur;
    d.className='dot'+(isDone?' done':isAct?' active':'');
    if(isDone){(function(s){d.addEventListener('click',function(){jumpTo(s);});})(i);}
    dots.appendChild(d);
  }
  var steps=SM[lang];
  $('slabel').textContent=steps[cur-1].l;
  $('scounter').textContent=cur+' / '+STEPS;
  var sb=$('sbsteps');sb.innerHTML='';
  steps.forEach(function(s,i){
    var n=i+1,isA=n===cur,isD=n<cur;
    var div=document.createElement('div');
    div.className='ss'+(isD?' cl':'');
    if(isD){(function(step){div.addEventListener('click',function(){jumpTo(step);});})(n);}
    div.innerHTML='<div class="sn'+(isA?' active':isD?' done':'')+'">'+
      (isD?'&#10003;':n)+'</div><div><div class="stt'+(!isA&&!isD?' m':'')+'">'+
      s.l+'</div><div class="ssb">'+s.s+'</div></div>';
    sb.appendChild(div);
  });
  $('btnBack').style.visibility=cur===1?'hidden':'visible';
  var isLast=cur===STEPS;
  $('btnNext').style.display=isLast?'none':'block';
  $('btnSubmit').classList.toggle('on',isLast);
  var sn=$('stickyNext');
  if(sn){
    sn.querySelector('span').innerHTML=isLast?t('submit'):t('cont');
    sn.onclick=isLast?function(){if(validate())$('wf').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));}:goNext;
  }
  sendHeight();
}

function jumpTo(n){cur=n;showStep(cur);scrollToTop();}

function showStep(n){
  for(var i=1;i<=STEPS;i++){var el=$('step'+i);if(el)el.classList.toggle('active',i===n);}
  updProg();
  sendHeight();
}

function updPgCounter(){
  var n=document.querySelectorAll('.pcb:checked').length;
  var c=$('pgc'),m=$('epm');
  if(n<=6){c.textContent=t('pgCounter')(n);c.className='pgc';hide('extra-pages-warn');}
  else{var e=n-6,cost=e*50;c.textContent=t('pgCounterOver')(n,e,cost);c.className='pgc ov';if(m)m.textContent=t('extraPagesMsg')(e,cost);show('extra-pages-warn');}
}

function updFeatCounter(){
  var c=$('feat-counter');
  if(!c)return;
  c.textContent=t('featCounter')(featCount);
  c.className=featCount>=6?'fc full':'fc';
}

// --- Inspiration nudge dialog ---
function showInspirationNudge(onContinue) {
  var existing = $('inspiration-nudge');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'inspiration-nudge';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:1000',
    'display:flex','align-items:center','justify-content:center',
    'background:rgba(0,0,0,0.55)','padding:16px'
  ].join(';');

  overlay.innerHTML =
    '<div style="background:#fff;border-radius:12px;padding:32px 28px;max-width:400px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,0.18)">' +
      '<div style="font-size:17px;font-weight:600;color:#111;margin-bottom:10px" id="nudge-title"></div>' +
      '<div style="font-size:14px;color:#6A7586;line-height:1.65;margin-bottom:20px" id="nudge-body"></div>' +
      '<a href="https://websites-catalog.webflow.io/client-catalog" target="_blank" ' +
        'style="display:inline-flex;align-items:center;gap:6px;padding:9px 18px;background:#1769ff;color:#fff;border-radius:6px;font-size:13px;font-weight:500;text-decoration:none;margin-bottom:12px" ' +
        'id="nudge-cta"></a>' +
      '<div>' +
        '<button type="button" id="nudge-dismiss" ' +
          'style="background:none;border:none;font-family:inherit;font-size:13px;color:#6A7586;cursor:pointer;padding:4px 0;text-decoration:underline">' +
        '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  $('nudge-title').textContent = t('inspirationNudgeTitle');
  $('nudge-body').textContent  = t('inspirationNudgeBody');
  $('nudge-cta').textContent   = t('inspirationNudgeCta');
  $('nudge-dismiss').textContent = t('inspirationNudgeContinue');

  $('nudge-dismiss').addEventListener('click', function() {
    overlay.remove();
    inspirationNudgeDismissed = true;
    onContinue();
  });

  // Clicking the backdrop also dismisses
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.remove();
      inspirationNudgeDismissed = true;
      onContinue();
    }
  });
}

function validate(){
  var ok=true;
  var firstBad=null;
  function req(fId,iId,fn){
    var f=$(fId),v=$(iId)?$(iId).value.trim():'';
    var bad=fn?!fn(v):v==='';
    if(f)f.classList.toggle('inv',bad);
    if(bad){ok=false;if(!firstBad&&f)firstBad=f;}
  }
  if(cur===1){
    req('f-bn','bizname');req('f-ba','bizaddr');req('f-bh','bizhours');req('f-about','about-biz');
    var fv=$('eforms')?$('eforms').value.trim():'';
    if(!fv){if($('eforms'))$('eforms').style.borderColor='#f87171';$('err-eforms').style.display='block';ok=false;if(!firstBad)firstBad=$('eforms');}
    else{if($('eforms'))$('eforms').style.borderColor='';$('err-eforms').style.display='none';}
    if(!document.querySelector('input[name="optimize-about"]:checked'))ok=false;
    if(!document.querySelector('input[name="primary-lang"]:checked'))ok=false;
    if(!document.querySelector('input[name="translate"]:checked'))ok=false;
  }
  if(cur===2){
    if(!document.querySelector('input[name="has-website"]:checked'))ok=false;
    var hw=document.querySelector('input[name="has-website"]:checked');
    if(hw&&hw.value==='Yes, I have an existing website'){if(!document.querySelector('input[name="domain-transfer"]:checked'))ok=false;}
    else if(hw){
      if(!document.querySelector('input[name="has-domain"]:checked'))ok=false;
      var hd=document.querySelector('input[name="has-domain"]:checked');
      if(hd&&hd.value==='Yes, I already have a domain'&&!document.querySelector('input[name="domain-transfer"]:checked'))ok=false;
      // CHANGE 2: Preferred domain name is required when user wants SpotOn to register one
      if(hd&&hd.value==='No, I need one (included in subscription)'){
        var prefInp=document.querySelector('input[name="domain-preferred"]');
        var prefErr=$('domain-preferred-err');
        var prefV=prefInp?prefInp.value.trim():'';
        if(!prefV){
          if(prefInp){prefInp.style.borderColor='#f87171';}
          if(prefErr){prefErr.style.display='block';}
          ok=false;
          if(!firstBad&&prefInp)firstBad=prefInp;
        } else {
          if(prefInp){prefInp.style.borderColor='';}
          if(prefErr){prefErr.style.display='none';}
        }
      }
    }
  }
  if(cur===3){
    if(!document.querySelector('input[name="has-logo"]:checked'))ok=false;
    var logoVal=document.querySelector('input[name="has-logo"]:checked');
    var needsLogoQ=logoVal&&(logoVal.value.indexOf('standard')>-1||logoVal.value.indexOf('custom')>-1);
    if(needsLogoQ){
      if(!document.querySelector('input[name="has-tagline"]:checked'))ok=false;
      var audF=$('f-logo-audience'),audV=$('logo-audience')&&$('logo-audience').value.trim();
      if(!audV){if(audF)audF.classList.add('inv');ok=false;if(!firstBad&&audF)firstBad=audF;}else{if(audF)audF.classList.remove('inv');}
      var ltF=$('f-logo-text'),ltV=$('logo-text')&&$('logo-text').value.trim();
      if(!ltV){if(ltF)ltF.classList.add('inv');ok=false;if(!firstBad&&ltF)firstBad=ltF;}else{if(ltF)ltF.classList.remove('inv');}
      var lsChecked=document.querySelectorAll('.lscb:checked').length;
      if(!lsChecked){$('logo-style-err').style.display='block';ok=false;if(!firstBad)firstBad=$('logo-style-err');}else{$('logo-style-err').style.display='none';}
    }
    // CHANGE 1: Color palette is required
    var colorsOk=!!document.querySelectorAll('#colors-group input:checked').length;
    var colErr=$('colors-err');
    if(!colorsOk){if(colErr)colErr.style.display='block';ok=false;if(!firstBad&&colErr)firstBad=colErr;}else{if(colErr)colErr.style.display='none';}
    var vibeOk=!!document.querySelector('input[name="vibe"]:checked');
    var vibeErr=$('vibe-err');
    if(!vibeOk){if(vibeErr)vibeErr.style.display='block';ok=false;if(!firstBad&&vibeErr)firstBad=vibeErr;}else{if(vibeErr)vibeErr.style.display='none';}
    // CHANGE 3: Inspiration field is required — show nudge dialog if empty and not yet dismissed
    var inspVal=document.querySelector('textarea[name="inspiration-urls"]');
    var inspErr=$('inspiration-err');
    if(inspVal&&!inspVal.value.trim()&&!inspirationNudgeDismissed){
      ok=false;
      if(inspErr)inspErr.style.display='block';
      // Only show the nudge if all other step 3 errors are already resolved
      // (avoids dialog appearing before the user has even filled the step)
      if(colorsOk&&vibeOk&&document.querySelector('input[name="has-logo"]:checked')){
        showInspirationNudge(function(){goNext();});
      } else {
        if(!firstBad&&inspErr)firstBad=inspErr;
      }
      return false;
    } else {
      if(inspErr)inspErr.style.display='none';
    }
  }
  if(cur===4){
    var imagesErr=$('images-err'),imagesOk=!!document.querySelectorAll('#images-group input:checked').length;
    if(imagesErr)imagesErr.style.display=imagesOk?'none':'block';
    if(!imagesOk){ok=false;if(!firstBad&&imagesErr)firstBad=imagesErr;}

    var pagesErr=$('pages-err'),pagesOk=!!document.querySelectorAll('.pcb:checked').length;
    if(pagesErr)pagesErr.style.display=pagesOk?'none':'block';
    if(!pagesOk){ok=false;if(!firstBad&&pagesErr)firstBad=pagesErr;}

    var mc=document.querySelector('input[name="page-menu"]');
    var menuTypeErr=$('menu-type-err');
    if(mc&&mc.checked){
      var menuTypeOk=!!document.querySelector('input[name="menu-type"]:checked');
      if(menuTypeErr)menuTypeErr.style.display=menuTypeOk?'none':'block';
      if(!menuTypeOk){ok=false;if(!firstBad&&menuTypeErr)firstBad=menuTypeErr;}
    } else if(menuTypeErr){
      menuTypeErr.style.display='none';
    }
  }
  if(cur===5){
    var tpP=[['tp-ordering-cb','tp-ordering-url'],['tp-res-cb','tp-res-url'],['tp-gc-cb','tp-gc-url'],['tp-loyalty-cb','tp-loyalty-url'],['tp-other-cb','tp-other-text']];
    tpP.forEach(function(p){var cb=$(p[0]),inp=$(p[1]);if(!cb||!inp)return;if(cb.checked&&!inp.value.trim()){inp.classList.add('err-inp');ok=false;}else{inp.classList.remove('err-inp');}});
  }
  if(cur===6){
    if(needNewDomain&&!document.querySelector('input[name="autopublish"]:checked'))ok=false;
    if(!$('terms-agreed').checked){$('terms-opt').style.borderColor='#f87171';$('terms-err').style.display='block';ok=false;}
    else{$('terms-opt').style.borderColor='#e0e3e9';$('terms-err').style.display='none';}
  }
  if(!ok&&firstBad){setTimeout(function(){firstBad.scrollIntoView({behavior:'smooth',block:'center'});},80);}
  return ok;
}

function goNext(){if(!validate())return;cur++;showStep(cur);scrollToTop();sendHeight();}
function goBack(){if(cur===1)return;cur--;showStep(cur);scrollToTop();sendHeight();}

function addFeat(){
  if(featCount>=6)return;featCount++;
  var list=$('feat-list'),row=document.createElement('div');
  row.className='fr';
  row.innerHTML='<div class="fn">'+featCount+'</div><input type="text" name="featured-'+featCount+'" placeholder="'+(lang==='es'?'ej. Art\u00edculo '+featCount:'Item '+featCount)+'">';
  list.appendChild(row);
  updFeatCounter();
  if(featCount>=6)$('add-feat-btn').style.display='none';
  sendHeight();
}

var RC=['Afghan','African','American (New)','American (Traditional)','Arabian','Argentine','Armenian','Asian Fusion','Australian','Austrian','Bangladeshi','Barbeque','Belgian','Bistros','Brazilian','Breakfast & Brunch','British','Buffets','Burgers','Burmese','Cafes','Cajun/Creole','Cambodian','Caribbean','Chicken Wings','Chinese','Comfort Food','Creperies','Cuban','Czech','Delis','Dim Sum','Diners','Ethiopian','Fast Food','Filipino','Fish & Chips','French','German','Gluten-Free','Greek','Halal','Hawaiian','Hot Dogs','Hot Pot','Hungarian','Indian','Indonesian','Irish','Italian','Japanese','Korean','Kosher','Latin American','Lebanese','Malaysian','Mediterranean','Mexican','Middle Eastern','Mongolian','Moroccan','Noodles','Pakistani','Pan Asian','Persian/Iranian','Peruvian','Pizza','Polish','Portuguese','Puerto Rican','Ramen','Russian','Salad','Salvadoran','Sandwiches','Seafood','Singaporean','Soup','Southern','Spanish','Sri Lankan','Steakhouses','Sushi Bars','Taiwanese','Tapas/Small Plates','Tex-Mex','Thai','Turkish','Vegan','Vegetarian','Venezuelan','Vietnamese','Wraps'];
var RRC=["Children's Clothing",'Clothing','Computers','Cosmetics & Beauty Supply','Department Stores','Electronics','Eyewear & Opticians','Fabric Stores','Fashion Accessories','Flowers & Gifts','Food & Beverage Retail','Furniture Stores','Gift Shops','Hardware Stores','Health Markets','Hobby Shops','Home & Garden','Home Decor','Jewelry','Kitchen & Bath','Luggage',"Men's Clothing",'Musical Instruments','Outlet Stores','Party Supplies','Pet Stores','Shoe Stores','Sporting Goods','Thrift Stores','Toy Stores','Vitamins & Supplements','Watches',"Women's Clothing"];

function hl(t2,q){var i=t2.toLowerCase().indexOf(q);if(i===-1)return t2;return t2.slice(0,i)+'<strong>'+t2.slice(i,i+q.length)+'</strong>'+t2.slice(i+q.length);}
function selDD(iId,dId,v){$(iId).value=v;$(dId).style.display='none';}
function setupDD(iId,dId,items){
  var inp=$(iId),dd=$(dId);if(!inp||!dd)return;
  inp.addEventListener('input',function(){
    var q=inp.value.trim().toLowerCase();if(!q){dd.style.display='none';return;}
    var m=items.filter(function(i){return i.toLowerCase().includes(q);}).slice(0,30);
    if(!m.length){dd.style.display='none';return;}
    dd.innerHTML=m.map(function(x){return'<div class="ddi" style="padding:9px 13px;font-size:13px;cursor:pointer;border-bottom:1px solid #f0f2f5;color:#333" onmousedown="selDD(\''+iId+'\',\''+dId+'\',\''+x.replace(/'/g,"\\'")+'\')">'+hl(x,q)+'</div>';}).join('');
    dd.style.display='block';
  });
  inp.addEventListener('blur',function(){setTimeout(function(){dd.style.display='none';},150);});
}

function sendHeight(){
  var h=document.documentElement.scrollHeight;
  try{window.parent.postMessage({type:'spoton-resize',height:h},'*');}catch(e){}
}
function scrollToTop(){
  window.scrollTo(0,0);
  try{window.parent.postMessage({type:'spoton-scroll-top'},'*');}catch(e){}
}
window.addEventListener('load',sendHeight);
window.addEventListener('resize',sendHeight);
var _mo=new MutationObserver(function(){sendHeight();});
_mo.observe(document.body,{childList:true,subtree:true,attributes:true,characterData:true});

function setup(){
  var tR=$('cb-rest'),tRo=$('opt-rest'),tRe=$('cb-ret'),tReo=$('opt-ret');
  on(tR,'change',function(){if(tR.checked){tRe.checked=false;tReo.classList.remove('sel');}tRo.classList.toggle('sel',tR.checked);tog('rest-sub-wrap',tR.checked);hide('ret-sub-wrap');sendHeight();});
  on(tRe,'change',function(){if(tRe.checked){tR.checked=false;tRo.classList.remove('sel');}tReo.classList.toggle('sel',tRe.checked);tog('ret-sub-wrap',tRe.checked);hide('rest-sub-wrap');sendHeight();});
  setupDD('rss','rsd',RC);setupDD('res','red',RRC);
  document.querySelectorAll('input[name="optimize-about"]').forEach(function(r){on(r,'change',function(){selRG('opt-about-group',r);});});
  document.querySelectorAll('input[name="primary-lang"]').forEach(function(r){on(r,'change',function(){tog('lang-other-wrap',r.value==='Other'&&r.checked);selRG('lang-group',r);sendHeight();});});
  document.querySelectorAll('input[name="translate"]').forEach(function(r){on(r,'change',function(){tog('translate-wrap',r.value.indexOf('specify')>-1&&r.checked);selRG('translate-group',r);sendHeight();});});
  document.querySelectorAll('input[name="has-website"]').forEach(function(r){
    on(r,'change',function(){
      var hw=r.value==='Yes, I have an existing website'&&r.checked;
      tog('existing-wrap',hw);tog('domain-q-wrap',!hw);tog('domain-owned-wrap',hw);tog('domain-name-wrap',!hw);
      hide('transfer-code-wrap');
      document.querySelectorAll('input[name="domain-transfer"]').forEach(function(i){i.checked=false;});
      document.querySelectorAll('#dt-group .ro').forEach(function(o){o.classList.remove('sel');});
      if(!hw){hide('domain-owned-wrap');hide('new-domain-wrap');document.querySelectorAll('input[name="has-domain"]').forEach(function(i){i.checked=false;});document.querySelectorAll('#hd-group .ro').forEach(function(o){o.classList.remove('sel');});}
      var iwo=$('images-website-opt');if(iwo)iwo.style.display=hw?'flex':'none';
      selRG('hw-group',r);sendHeight();
    });
  });
  document.querySelectorAll('input[name="use-existing-content"]').forEach(function(r){on(r,'change',function(){tog('upload-content-wrap',r.value.indexOf('provide')>-1&&r.checked);selRG('usecontent-group',r);sendHeight();});});
  document.querySelectorAll('input[name="has-domain"]').forEach(function(r){
    on(r,'change',function(){
      var owns=r.value.indexOf('already')>-1&&r.checked,needs=r.value.indexOf('need one')>-1&&r.checked;
      tog('domain-owned-wrap',owns);tog('domain-name-wrap',owns);tog('new-domain-wrap',needs);
      if(!owns)hide('transfer-code-wrap');
      needNewDomain=needs;tog('autopublish-wrap',needs);
      selRG('hd-group',r);sendHeight();
    });
  });
  document.querySelectorAll('input[name="domain-transfer"]').forEach(function(r){on(r,'change',function(){tog('transfer-code-wrap',r.value.indexOf('Transfer')>-1&&r.checked);selRG('dt-group',r);sendHeight();});});
  document.querySelectorAll('input[name="has-logo"]').forEach(function(r){
    on(r,'change',function(){
      tog('logo-upload-wrap',r.value.indexOf('have a logo')>-1&&r.checked);
      tog('standard-logo-wrap',r.value.indexOf('standard')>-1&&r.checked);
      tog('custom-logo-wrap',r.value.indexOf('custom')>-1&&r.checked);
      tog('logo-notes-wrap',(r.value.indexOf('standard')>-1||r.value.indexOf('custom')>-1)&&r.checked);
      tog('no-logo-wrap',r.value==='No logo, just text'&&r.checked);
      selRG('logo-group',r);sendHeight();
    });
  });
  document.querySelectorAll('input[name="has-tagline"]').forEach(function(r){
    on(r,'change',function(){tog('tagline-wrap',r.value==='Yes'&&r.checked);selRG('tagline-group',r);sendHeight();});
  });
  document.querySelectorAll('input[name="tagline-in-logo"]').forEach(function(r){
    on(r,'change',function(){selRG('tagline-include-group',r);});
  });
  document.querySelectorAll('.lscb').forEach(function(cb){
    on(cb,'change',function(){
      var checked=document.querySelectorAll('.lscb:checked');
      if(checked.length>3){cb.checked=false;return;}
      cb.closest('.co').classList.toggle('sel',cb.checked);
    });
  });
  on($('colors-other-cb'),'change',function(){tog('colors-other-wrap',this.checked);$('colors-other-opt').classList.toggle('sel',this.checked);if($('colors-err'))$('colors-err').style.display='none';sendHeight();});
  document.querySelectorAll('#colors-group input').forEach(function(inp){if(inp.id==='colors-other-cb')return;on(inp,'change',function(){inp.closest('.co').classList.toggle('sel',inp.checked);if($('colors-err'))$('colors-err').style.display='none';});});
  document.querySelectorAll('input[name="vibe"]').forEach(function(r){on(r,'change',function(){tog('vibe-other-wrap',r.value==='Other'&&r.checked);selRG('vibe-group',r);if($('vibe-err'))$('vibe-err').style.display='none';sendHeight();});});
  on($('images-upload-cb'),'change',function(){tog('images-upload-wrap',this.checked);this.closest('.co').classList.toggle('sel',this.checked);if(document.querySelectorAll('#images-group input:checked').length&&$('images-err'))$('images-err').style.display='none';sendHeight();});
  document.querySelectorAll('#images-group input').forEach(function(inp){if(inp.id==='images-upload-cb')return;on(inp,'change',function(){inp.closest('.co').classList.toggle('sel',inp.checked);if(document.querySelectorAll('#images-group input:checked').length&&$('images-err'))$('images-err').style.display='none';});});
  document.querySelectorAll('.pcb').forEach(function(cb){
    on(cb,'change',function(){
      if(cb.id!=='page-other-cb')cb.closest('.co').classList.toggle('sel',cb.checked);
      updPgCounter();
      if(document.querySelectorAll('.pcb:checked').length&&$('pages-err'))$('pages-err').style.display='none';
      var mc=document.querySelector('input[name="page-menu"]'),showMenu=mc&&mc.checked;
      tog('menu-page-wrap',showMenu);tog('featured-wrap',showMenu);
      var hasBlog=document.querySelector('input[name="page-blog"]:checked');
      var hasFaq=document.querySelector('input[name="page-faq"]:checked');
      var bfw=$('blog-faq-warn');
      if(bfw){
        bfw.classList.toggle('on',!!(hasBlog||hasFaq));
        var both=hasBlog&&hasFaq,blogOnly=hasBlog&&!hasFaq;
        var wt=$('blog-faq-warn-title'),wb=$('blog-faq-warn-body');
        if(wt){if(both){wt.textContent=lang==='es'?'Blog/Noticias y Preguntas frecuentes':'Blog/News & FAQ';}else if(blogOnly){wt.textContent=lang==='es'?'Blog/Noticias':'Blog/News';}else{wt.textContent=lang==='es'?'Preguntas frecuentes':'FAQ';}}
        if(wb){wb.textContent=lang==='es'?' \u2014 Necesitaremos que usted nos proporcione el contenido para esta(s) p\u00e1gina(s).':' \u2014 You will need to provide the content for these pages.';}
      }
      sendHeight();
    });
  });
  on($('page-other-cb'),'change',function(){tog('page-other-wrap',this.checked);$('page-other-opt').classList.toggle('sel',this.checked);sendHeight();});
  document.querySelectorAll('input[name="menu-type"]').forEach(function(r){
    on(r,'change',function(){
      var ids=['mopt-ordering','mopt-spoton','mopt-image','mopt-other'];
      ids.forEach(function(id){var el=$(id);if(el){el.className=id==='mopt-ordering'?'mopt feat':'mopt';}});
      var map={'Link directly to my online ordering':'mopt-ordering','Sync with my SpotOn online ordering':'mopt-spoton','Display my menu as an image or PDF':'mopt-image','other':'mopt-other'};
      if(map[r.value]){var el=$(map[r.value]);if(el)el.classList.add('act');}
      tog('menu-upload-wrap',r.value.indexOf('image')>-1&&r.checked);
      tog('menu-other-wrap',r.value==='other'&&r.checked);
      if($('menu-type-err'))$('menu-type-err').style.display='none';
      sendHeight();
    });
  });
  var tpList=[['tp-ordering-cb','tp-ordering-url-wrap','tp-ordering-opt'],['tp-res-cb','tp-res-url-wrap','tp-res-opt'],['tp-gc-cb','tp-gc-url-wrap','tp-gc-opt'],['tp-loyalty-cb','tp-loyalty-url-wrap','tp-loyalty-opt'],['tp-other-cb','tp-other-url-wrap','tp-other-opt']];
  tpList.forEach(function(arr){
    var cb=$(arr[0]);
    on(cb,'change',function(){
      var wrap=$(arr[1]),opt=$(arr[2]);
      if(wrap)wrap.classList.toggle('on',cb.checked);
      if(opt)opt.classList.toggle('act',cb.checked);
      sendHeight();
    });
  });
  document.querySelectorAll('input[name="autopublish"]').forEach(function(r){on(r,'change',function(){selRG('autopublish-group',r);});});
  on($('terms-agreed'),'change',function(){
    $('terms-opt').classList.toggle('sel',this.checked);
    if(this.checked){$('terms-opt').style.borderColor='var(--blue)';$('terms-err').style.display='none';}
  });

  // Reset inspirationNudgeDismissed if user edits the inspiration field after dismissing
  var inspInp=document.querySelector('textarea[name="inspiration-urls"]');
  if(inspInp){
    inspInp.addEventListener('input',function(){
      if(inspInp.value.trim()){
        inspirationNudgeDismissed=false;
        var inspErr=$('inspiration-err');
        if(inspErr)inspErr.style.display='none';
      }
    });
  }
}

document.getElementById('wf').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validate()) return;
  var form = this;
  var btn = $('btnSubmit');
  btn.disabled = true;
  btn.querySelector('span').textContent = lang === 'es' ? 'Enviando\u2026' : 'Sending\u2026';
  var data = new FormData(form);
  fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  }).then(function(r){ return r.json().then(function(j){ return {ok: r.ok, json: j}; }); })
  .then(function(res) {
    if (res.ok) {
      window.location.href = 'https://andresaromeroa1985.github.io/sd-wdd-wq/thanks.html?lang=' + lang;
    } else {
      btn.disabled = false;
      btn.querySelector('span').textContent = lang === 'es' ? 'Enviar cuestionario' : 'Submit questionnaire';
      alert(lang === 'es' ? 'Hubo un error al enviar. Por favor intente de nuevo.' : 'There was an error submitting. Please try again.');
    }
  }).catch(function() {
    btn.disabled = false;
    btn.querySelector('span').textContent = lang === 'es' ? 'Enviar cuestionario' : 'Submit questionnaire';
    alert(lang === 'es' ? 'Hubo un error al enviar. Por favor intente de nuevo.' : 'There was an error submitting. Please try again.');
  });
});

setup();
applyLang();
showStep(1);
sendHeight();
