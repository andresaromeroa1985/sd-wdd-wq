var STEPS=6,cur=1,needNewDomain=false,featCount=3,lang='en';

// Furthest step the client has reached. Steps up to here are navigable in both
// directions via the sidebar and the progress bars; anything past it is locked,
// so the stepper can't be used to skip ahead of the questions.
var maxStep=1;
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
    inspirationDesc:'You can also upload a flyer, poster, or social media post using the upload box further down this step.\n\nTo view example websites made by us, <a href="https://websites-catalog.webflow.io/client-catalog" target="_blank" style="color:var(--blue);font-weight:500">click here \u2197</a>',
    pageSpecificsHint:'Please tell us: which page, what content, and any external links (Yelp, TripAdvisor, reservations, press, etc.)<br><em>Example: Home \u2014 Include: About us, Featured dishes, Menu, Catering, Newsletter, Contact</em>',
    autopublishDesc:"Once your website draft is complete, our team will reach out to you at least 5 times to get your approval. If we're unable to reach you, your website will be auto-published to your domain so it can start ranking in Google's search engines.<br><br>If you prefer not to auto-publish, your subscription will simply be put on hold until you get back to us.",
    tcBody:'<strong>SpotOn Website Services — Terms &amp; Conditions</strong><br><br>By accepting these terms and conditions, you confirm that all the information you provide is true and accurate, and that you have read and agreed to the following:<br><br><strong>Copy Optimization.</strong> By agreeing to have your website content optimized, you are accepting the use of generative artificial intelligence in the process.<br><br><strong>Copyright License.</strong> By accepting these terms, you confirm that you have the proper copyright licenses for all the content you send us or approve for use on your website. This includes (but is not limited to) images, videos, fonts, logos, and text.<br><br><strong>Domain Transfer.</strong> By agreeing to transfer your domain, you are handing over ownership of the domain to SpotOn. You may request the return of the domain at any time. Once the request has been made and the transfer code provided, you will have a period of 15 calendar days to complete the transfer. If you do not do it within this period, you will lose the opportunity to recover it free of cost. Please note that if a domain has recently been purchased or transferred, we must wait 60 days, per ICANN norms, before being able to transfer again.<br><br><strong>Fees.</strong> Fees may change over time.<br><br><strong>Third-Party Integrations.</strong> We do not provide support for issues related to third-party integrations, nor can we guarantee they will always work correctly.<br><br><strong>Ongoing Support.</strong> Before your website is published, you can contact us anytime at <a href="mailto:websiteimp@spoton.com" style="color:var(--blue)">websiteimp@spoton.com</a> or <a href="https://book-a-website-call.webflow.io/" target="_blank" style="color:var(--blue)">book a call</a> to speak with a website implementation specialist.<br><br>Once your website is live, please contact our support team at <a href="mailto:support@spoton.com" style="color:var(--blue)">support@spoton.com</a> or call <a href="tel:+18778144102" style="color:var(--blue)">(877) 814-4102</a> for further assistance.',
    back:'\u2190 Back',
    cont:'Continue',
    submit:'Submit questionnaire',
    inspirationNudgeTitle:"No inspiration site?",
    inspirationNudgeBody:"That's totally fine — but we'd love for you to browse our website examples so our team has a better sense of your style.",
    inspirationNudgeCta:"View our website examples \u2197",
    inspirationNudgeContinue:"Continue without one",
    inspirationErr:"Please share an inspiration site or URL — or visit our examples and describe a style you like.",
    mockupTipBody:'\ud83d\udca1 If you have a mockup, wireframe, or are working with your own web designer, please share it with us — it helps us build your site exactly the way you envision it. You can paste a link below or add the files right here.',

    /* ── Inline uploader ── */
    upDropMain:'Drag &amp; drop files here',
    upDropSub:'or <span class="up-link">browse your device</span>',
    upDropHint:function(mb){return 'Images, PDFs and documents \u2014 up to '+mb+'MB per file';},
    upBtnIdle:'Upload files',
    upBtn:function(n){return 'Upload '+n+' file'+(n===1?'':'s');},
    upBtnMore:'Add more files',
    upProgress:function(i,n,name){return 'Uploading '+i+' of '+n+' \u2014 '+name;},
    upDoneTitle:function(n){return n+' file'+(n===1?'':'s')+' uploaded';},
    upDoneBody:"Saved to your project folder. You can keep adding files or move on.",
    upRemove:'Remove',
    upErrTooBig:function(names,mb){return 'Too large to upload (max '+mb+'MB each): '+names+'. Please resize or send them to websiteimp@spoton.com instead.';},
    upErrFailed:function(names){return "These files didn't upload: "+names+'. Please try again, or email them to websiteimp@spoton.com.';},
    upErrNoBiz:'Please enter your business name in step 1 before uploading.',
    upTipTitle:'Name your food photos correctly',
    upTipBody:'If you\u2019re uploading menu item photos, please <strong>rename each file to match the dish name</strong> before uploading.<br>For example: <code>Grilled Salmon.jpg</code>, <code>Caesar Salad.png</code>',
    upNoFilesWarn:"You haven't uploaded any files yet. You can continue \u2014 but we'll start your build without them."
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
    inspirationDesc:'Tambi\u00e9n puede subir un volante, p\u00f3ster o publicaci\u00f3n de redes sociales usando el cuadro de carga m\u00e1s abajo en este paso.\n\nPara ver ejemplos de sitios web hechos por nosotros, <a href="https://websites-catalog.webflow.io/client-catalog" target="_blank" style="color:var(--blue);font-weight:500">haga clic aqu\u00ed \u2197</a>',
    pageSpecificsHint:'Por favor ind\u00edquenos: qu\u00e9 p\u00e1gina, qu\u00e9 contenido, y cualquier enlace externo (Yelp, TripAdvisor, reservaciones, prensa, etc.)<br><em>Ejemplo: Inicio \u2014 Incluir: Sobre nosotros, Platillos destacados, Men\u00fa, Catering, Newsletter, Contacto</em>',
    autopublishDesc:'Una vez que el borrador de su sitio web est\u00e9 listo, nuestro equipo lo contactar\u00e1 al menos 5 veces para obtener su aprobaci\u00f3n. Si no podemos comunicarnos con usted, su sitio web se publicar\u00e1 autom\u00e1ticamente para que comience a posicionarse en Google.<br><br>Si prefiere que no se publique autom\u00e1ticamente, su suscripci\u00f3n simplemente se pausar\u00e1 hasta que se comunique con nosotros.',
    tcBody:'<strong>SpotOn Servicios Web — T\u00e9rminos y Condiciones</strong><br><br>Al aceptar estos t\u00e9rminos y condiciones, usted confirma que toda la informaci\u00f3n que proporciona es verdadera y precisa, y que ha le\u00eddo y aceptado lo siguiente:<br><br><strong>Optimizaci\u00f3n de contenido.</strong> Al aceptar que el contenido de su sitio web sea optimizado, usted acepta el uso de inteligencia artificial generativa en el proceso.<br><br><strong>Licencia de derechos de autor.</strong> Al aceptar estos t\u00e9rminos, usted confirma que posee las licencias de derechos de autor adecuadas para todo el contenido que nos env\u00ede o apruebe para su uso en su sitio web. Esto incluye (pero no se limita a) im\u00e1genes, videos, fuentes, logotipos y texto.<br><br><strong>Transferencia de dominio.</strong> Al aceptar transferir su dominio, usted cede la propiedad del dominio a SpotOn. Puede solicitar la devoluci\u00f3n del dominio en cualquier momento. Una vez realizada la solicitud y proporcionado el c\u00f3digo de transferencia, tendr\u00e1 un per\u00edodo de 15 d\u00edas calendario para completar la transferencia. Si no lo hace dentro de este per\u00edodo, perder\u00e1 la oportunidad de recuperarlo sin costo. Tenga en cuenta que si un dominio ha sido comprado o transferido recientemente, debemos esperar 60 d\u00edas, seg\u00fan las normas de ICANN, antes de poder transferirlo nuevamente.<br><br><strong>Tarifas.</strong> Las tarifas pueden cambiar con el tiempo.<br><br><strong>Integraciones de terceros.</strong> No brindamos soporte para problemas relacionados con integraciones de terceros, ni podemos garantizar que siempre funcionen correctamente.<br><br><strong>Soporte continuo.</strong> Antes de que su sitio web sea publicado, puede contactarnos en cualquier momento en <a href="mailto:websiteimp@spoton.com" style="color:var(--blue)">websiteimp@spoton.com</a> o <a href="https://book-a-website-call.webflow.io/" target="_blank" style="color:var(--blue)">agendar una llamada</a> para hablar con un especialista en implementaci\u00f3n de sitios web.<br><br>Una vez que su sitio web est\u00e9 activo, comun\u00edquese con nuestro equipo de soporte en <a href="mailto:support@spoton.com" style="color:var(--blue)">support@spoton.com</a> o llame al <a href="tel:+18778144102" style="color:var(--blue)">(877) 814-4102</a> para obtener m\u00e1s asistencia.',
    back:'\u2190 Atr\u00e1s',
    cont:'Continuar',
    submit:'Enviar cuestionario',
    inspirationNudgeTitle:"¿No tiene sitio de inspiración?",
    inspirationNudgeBody:"No hay problema — pero le recomendamos explorar nuestros ejemplos de sitios web para que nuestro equipo tenga una mejor idea de su estilo.",
    inspirationNudgeCta:"Ver nuestros ejemplos de sitios web \u2197",
    inspirationNudgeContinue:"Continuar sin uno",
    inspirationErr:"Por favor comparta un sitio de inspiración o URL — o visite nuestros ejemplos y describa un estilo que le guste.",
    mockupTipBody:'\ud83d\udca1 Si tiene una maqueta, wireframe o est\u00e1 trabajando con su propio dise\u00f1ador web, por favor comp\u00e1rtalo con nosotros — nos ayuda a construir su sitio exactamente como lo imagina. Puede pegar un enlace abajo o agregar los archivos aqu\u00ed mismo.',

    /* ── Inline uploader ── */
    upDropMain:'Arrastre y suelte sus archivos aqu\u00ed',
    upDropSub:'o <span class="up-link">busque en su dispositivo</span>',
    upDropHint:function(mb){return 'Im\u00e1genes, PDFs y documentos \u2014 hasta '+mb+'MB por archivo';},
    upBtnIdle:'Subir archivos',
    upBtn:function(n){return 'Subir '+n+' archivo'+(n===1?'':'s');},
    upBtnMore:'Agregar m\u00e1s archivos',
    upProgress:function(i,n,name){return 'Subiendo '+i+' de '+n+' \u2014 '+name;},
    upDoneTitle:function(n){return n+' archivo'+(n===1?'':'s')+(n===1?' subido':' subidos');},
    upDoneBody:'Guardado en la carpeta de su proyecto. Puede seguir agregando archivos o continuar.',
    upRemove:'Quitar',
    upErrTooBig:function(names,mb){return 'Demasiado grande para subir (m\u00e1ximo '+mb+'MB cada uno): '+names+'. Por favor red\u00fazcalo o envíelo a websiteimp@spoton.com.';},
    upErrFailed:function(names){return 'Estos archivos no se subieron: '+names+'. Por favor intente de nuevo, o env\u00edelos por correo a websiteimp@spoton.com.';},
    upErrNoBiz:'Por favor ingrese el nombre de su negocio en el paso 1 antes de subir archivos.',
    upTipTitle:'Nombre correctamente sus fotos de comida',
    upTipBody:'Si va a subir fotos del men\u00fa, por favor <strong>renombre cada archivo con el nombre del platillo</strong> antes de subirlo.<br>Por ejemplo: <code>Tacos de Birria.jpg</code>, <code>Pozole Rojo.png</code>',
    upNoFilesWarn:'A\u00fan no ha subido ning\u00fan archivo. Puede continuar \u2014 pero comenzaremos su sitio sin ellos.'
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
  if($('tc-body'))$('tc-body').innerHTML=t('tcBody');
  updFeatCounter();
  updPgCounter();
  upApplyLang();
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
  // A step is navigable if the client has already reached it. "Completed" means
  // they got past it at some point, which is independent of where they are now —
  // so going back to step 2 leaves steps 3-5 showing as done, and clickable.
  var dots=$('dots');dots.innerHTML='';
  for(var i=1;i<=STEPS;i++){
    var d=document.createElement('div');
    var isAct=i===cur,isDone=!isAct&&i<maxStep,isAhead=!isAct&&i===maxStep;
    d.className='dot'+(isAct?' active':isDone?' done':isAhead?' ahead':'');
    if(!isAct&&i<=maxStep){(function(s){d.addEventListener('click',function(){jumpTo(s);});})(i);}
    dots.appendChild(d);
  }
  var steps=SM[lang];
  $('slabel').textContent=steps[cur-1].l;
  $('scounter').textContent=cur+' / '+STEPS;
  var sb=$('sbsteps');sb.innerHTML='';
  steps.forEach(function(s,i){
    var n=i+1,isA=n===cur,isD=!isA&&n<maxStep,canGo=!isA&&n<=maxStep;
    var div=document.createElement('div');
    div.className='ss'+(canGo?' cl':'');
    if(canGo){(function(step){div.addEventListener('click',function(){jumpTo(step);});})(n);}
    div.innerHTML='<div class="sn'+(isA?' active':isD?' done':'')+'">'+
      (isD?'&#10003;':n)+'</div><div><div class="stt'+(!isA&&n>maxStep?' m':'')+'">'+
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

function jumpTo(n){
  if(n===cur||n<1||n>STEPS)return;

  // Backward is always free — they've already answered what's behind them.
  if(n<cur){cur=n;showStep(cur);scrollToTop();return;}

  // Forward only as far as they've been, and only through steps that still
  // validate. Without this check the stepper would be a way around validation:
  // go back to step 1, clear a required field, click step 6, submit — and
  // submit only re-checks the step it's on.
  if(n>maxStep)return;
  while(cur<n){
    if(!validate()){showStep(cur);scrollToTop();return;}
    cur++;
  }
  showStep(cur);
  scrollToTop();
}

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

// Auto-publish only applies when SpotOn registers the domain — we can't
// auto-publish to a domain we don't control. This clears the question and any
// stale answer whenever that stops being true, so step 6 never demands an
// answer to a question the client can't see.
function resetAutopublish(){
  needNewDomain=false;
  hide('autopublish-wrap');
  document.querySelectorAll('input[name="autopublish"]').forEach(function(i){i.checked=false;});
  document.querySelectorAll('#autopublish-group .ro').forEach(function(o){o.classList.remove('sel');});
  var apErr=$('autopublish-err');
  if(apErr)apErr.style.display='none';
}

// Wipe every domain sub-answer below the "do you have a website?" question.
// Called whenever that top-level answer changes, in either direction — the
// answers underneath it are no longer meaningful.
function resetDomainAnswers(){
  hide('new-domain-wrap');
  document.querySelectorAll('input[name="has-domain"]').forEach(function(i){i.checked=false;});
  document.querySelectorAll('#hd-group .ro').forEach(function(o){o.classList.remove('sel');});

  var pref=document.querySelector('input[name="domain-preferred"]');
  if(pref)pref.style.borderColor='';
  if($('domain-preferred-err'))$('domain-preferred-err').style.display='none';

  var dn=document.querySelector('input[name="domain-name"]');
  if(dn)dn.style.borderColor='';
  if($('domain-name-err'))$('domain-name-err').style.display='none';

  resetAutopublish();
}

/* ═══════════════════════════════════════════════════════════════════════════
   INLINE FILE UPLOADER
   ───────────────────────────────────────────────────────────────────────────
   Replaces the old links out to spoton-website-contents.tiiny.site. Files now
   upload from inside the questionnaire, straight to the same Google Apps Script
   Web App the tiiny page used — so Drive folders, permissions and the receiving
   script are unchanged. What's new:
     · No new browser tab, so clients can't strand themselves mid-upload
     · Business name is read from step 1 instead of being retyped
     · Each file carries a category, so Drive can sort logo / photos / menu
     · Per-file size cap with real error copy instead of a silent failure count
     · An upload summary rides along in the submission payload
   ═══════════════════════════════════════════════════════════════════════════ */

// Same endpoint the tiiny.site page posted to — writes into Google Drive.
var UPLOAD_ENDPOINT='https://script.google.com/macros/s/AKfycbzq3beJUZe-GOb4SLexoOhyDtpdhapXYE5gAty-E4wMIhaP-wnw6QXqc9y6P7ENMAQ-aQ/exec';

// Per-file ceiling. Apps Script chokes on very large base64 payloads, and phone
// photos routinely land at 8-12MB, so this is generous but bounded.
var MAX_FILE_MB=20;

// Which uploader belongs where. Keyed by the id of the wrapper the old tiiny
// link sat inside; anything unmatched falls back to 'inspiration'.
var UP_BY_WRAP={
  'logo-upload-wrap':'logo',
  'upload-content-wrap':'content',
  'images-upload-wrap':'photos',
  'menu-upload-wrap':'menu'
};

// Categories that get the "name your food photos" tip.
var UP_TIP_CATS={photos:1,menu:1};

// Stable English labels sent to Apps Script. These drive Drive subfolder names,
// so they must NOT be translated — a Spanish-language client's files still need
// to land in the same folder a designer expects.
var UP_DRIVE_LABEL={
  logo:'Logo',
  photos:'Photos',
  menu:'Menu',
  inspiration:'Inspiration',
  content:'Website content'
};

// cat -> { sel:[File], done:[String], busy:Bool }
var upState={};

var UP_CSS=[
'.up{margin-top:10px}',
'.up-dz{position:relative;border:2px dashed #d0d8e4;border-radius:var(--rl);background:#f8f9fb;padding:24px 18px;text-align:center;cursor:pointer;transition:background .18s,border-color .18s}',
'.up-dz:hover,.up-dz.drag{background:#f0f5ff;border-color:var(--blue)}',
'.up-dz input[type=file]{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;cursor:pointer}',
'.up-ico{width:44px;height:44px;margin:0 auto 10px;border-radius:10px;background:#fff;border:1.5px solid #e0e3e9;display:flex;align-items:center;justify-content:center;transition:border-color .18s}',
'.up-dz:hover .up-ico{border-color:var(--blue)}',
'.up-ico svg{width:20px;height:20px;stroke:var(--blue);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
'.up-main{font-size:14px;font-weight:500;color:#111;margin-bottom:3px}',
'.up-sub{font-size:12.5px;color:var(--tg)}',
'.up-link{color:var(--blue);font-weight:500}',
'.up-hint{font-size:11.5px;color:var(--tg);margin-top:6px}',
'.up-tip{display:flex;gap:11px;align-items:flex-start;background:#f0f5ff;border-left:3px solid var(--blue);border-radius:0 var(--r) var(--r) 0;padding:12px 14px;margin-bottom:10px}',
'.up-tip-ico{font-size:15px;line-height:1.3;flex-shrink:0}',
'.up-tip-t{font-size:12.5px;font-weight:500;color:#1a3a6e;margin-bottom:3px}',
'.up-tip-b{font-size:12px;color:#33507d;line-height:1.6}',
'.up-tip-b code{font-family:var(--f);font-weight:500;color:var(--blue);font-size:11.5px}',
'.up-list{display:flex;flex-direction:column;gap:6px;margin-top:10px}',
'.up-item{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #e0e3e9;border-radius:var(--r);padding:9px 12px}',
'.up-item.ok{border-color:rgba(23,105,255,0.35);background:#f8faff}',
'.up-item-ico{font-size:14px;flex-shrink:0}',
'.up-item-n{flex:1;font-size:12.5px;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'.up-item-s{font-size:11px;color:var(--tg);flex-shrink:0}',
'.up-item-x{background:none;border:none;cursor:pointer;color:#b8c0cc;font-size:15px;line-height:1;padding:2px 3px;border-radius:4px;font-family:var(--f)}',
'.up-item-x:hover{color:#ef4444}',
'.up-prog{display:none;margin-top:10px}',
'.up-track{height:5px;background:#e8eaf0;border-radius:99px;overflow:hidden}',
'.up-fill{height:100%;width:0;background:var(--blue);border-radius:99px;transition:width .25s ease}',
'.up-progtxt{font-size:11.5px;color:var(--tg);margin-top:6px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
'.up-btn{margin-top:10px}',
'.up-btn:disabled{background:#c8d6f5;cursor:not-allowed}',
'.up-status{display:none;font-size:12px;line-height:1.55;margin-top:9px;padding:10px 12px;border-radius:var(--r)}',
'.up-status.on{display:block}',
'.up-status.bad{background:#fff5f5;border:1px solid #f5c2c2;color:#c0392b}',
'.up-done{display:none;align-items:flex-start;gap:11px;margin-top:10px;padding:12px 14px;background:#f0f5ff;border:1.5px solid rgba(23,105,255,0.3);border-radius:var(--r)}',
'.up-done.on{display:flex}',
'.up-done-ico{width:22px;height:22px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}',
'.up-done-t{font-size:12.5px;font-weight:500;color:#1a3a6e;margin-bottom:2px}',
'.up-done-b{font-size:12px;color:#33507d;line-height:1.55}',
'.up-warn{display:none;font-size:12px;line-height:1.55;margin-top:8px;padding:10px 12px;background:#fffbeb;border:1px solid #fde68a;border-radius:var(--r);color:#92400e}',
'.up-warn.on{display:block}',

/* Stepper: the "reached but not yet completed" progress bar. Sits between the
   filled-in look of a completed step and the flat look of a locked one. */
'.dot.ahead{background:rgba(23,105,255,0.22);cursor:pointer}',
'.dot.ahead:hover{background:var(--blue);transform:scaleY(1.6)}'
].join('');

function injectRuntimeCSS(){
  if($('form-runtime-css'))return;
  var s=document.createElement('style');
  s.id='form-runtime-css';
  s.textContent=UP_CSS;
  document.head.appendChild(s);
}

function upBiz(){
  var el=$('bizname');
  return el?el.value.trim():'';
}

function upFmtSize(b){
  return b>1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';
}

function upFileIcon(f){
  if(f.type&&f.type.indexOf('image/')===0)return '\ud83d\uddbc\ufe0f';
  if(f.type==='application/pdf')return '\ud83d\udcc4';
  return '\ud83d\udcce';
}

// Build one uploader widget in place of the given tiiny link.
function upBuild(anchor,cat){
  var host=document.createElement('div');
  host.className='up';
  host.id='up-'+cat;
  host.setAttribute('data-up-cat',cat);

  var tip=UP_TIP_CATS[cat]
    ?'<div class="up-tip"><span class="up-tip-ico">\ud83d\udccc</span><div><div class="up-tip-t" id="up-tipt-'+cat+'"></div><div class="up-tip-b" id="up-tipb-'+cat+'"></div></div></div>'
    :'';

  host.innerHTML=tip+
    '<div class="up-dz" id="up-dz-'+cat+'">'+
      '<input type="file" multiple id="up-input-'+cat+'">'+
      '<div class="up-ico"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>'+
      '<div class="up-main" id="up-main-'+cat+'"></div>'+
      '<div class="up-sub" id="up-sub-'+cat+'"></div>'+
      '<div class="up-hint" id="up-hint-'+cat+'"></div>'+
    '</div>'+
    '<div class="up-list" id="up-list-'+cat+'"></div>'+
    '<div class="up-prog" id="up-prog-'+cat+'">'+
      '<div class="up-track"><div class="up-fill" id="up-fill-'+cat+'"></div></div>'+
      '<div class="up-progtxt" id="up-progtxt-'+cat+'"></div>'+
    '</div>'+
    '<div class="up-done" id="up-done-'+cat+'">'+
      '<div class="up-done-ico">\u2713</div>'+
      '<div><div class="up-done-t" id="up-donet-'+cat+'"></div><div class="up-done-b" id="up-doneb-'+cat+'"></div></div>'+
    '</div>'+
    '<div class="up-status" id="up-status-'+cat+'"></div>'+
    '<div class="up-warn" id="up-warn-'+cat+'"></div>'+
    '<button type="button" class="btn up-btn" id="up-btn-'+cat+'" disabled></button>';

  // Drop the old outbound link and the hint that told clients they'd be taken
  // to another page — neither is true any more.
  var sib=anchor.nextElementSibling;
  if(sib&&sib.classList.contains('hint')){
    var hintTxt=(sib.getAttribute('data-en')||'')+(sib.textContent||'');
    if(/upload page|p\u00e1gina segura de carga|secure upload/i.test(hintTxt))sib.remove();
  }
  anchor.parentNode.replaceChild(host,anchor);

  upState[cat]={sel:[],done:[],busy:false};
  upWire(cat);
  return host;
}

function upWire(cat){
  var dz=$('up-dz-'+cat),input=$('up-input-'+cat),btn=$('up-btn-'+cat);

  on(input,'change',function(){upAdd(cat,input.files);input.value='';});

  on(dz,'dragover',function(e){e.preventDefault();dz.classList.add('drag');});
  on(dz,'dragleave',function(){dz.classList.remove('drag');});
  on(dz,'drop',function(e){
    e.preventDefault();
    dz.classList.remove('drag');
    if(e.dataTransfer&&e.dataTransfer.files)upAdd(cat,e.dataTransfer.files);
  });

  on(btn,'click',function(){upSend(cat);});
}

function upAdd(cat,files){
  var st=upState[cat];
  if(!st||st.busy)return;
  var tooBig=[],limit=MAX_FILE_MB*1048576;
  for(var i=0;i<files.length;i++){
    var f=files[i];
    if(f.size>limit){tooBig.push(f.name);continue;}
    // Skip exact duplicates already queued or already uploaded
    var dupe=st.done.indexOf(f.name)>-1;
    for(var j=0;j<st.sel.length&&!dupe;j++){
      if(st.sel[j].name===f.name&&st.sel[j].size===f.size)dupe=true;
    }
    if(!dupe)st.sel.push(f);
  }
  if(tooBig.length)upStatus(cat,t('upErrTooBig')(tooBig.join(', '),MAX_FILE_MB));
  else upStatus(cat,'');
  upRender(cat);
}

function upRemove(cat,idx){
  var st=upState[cat];
  if(!st||st.busy)return;
  st.sel.splice(idx,1);
  upRender(cat);
}

function upStatus(cat,msg){
  var el=$('up-status-'+cat);
  if(!el)return;
  el.textContent=msg||'';
  el.className='up-status'+(msg?' on bad':'');
}

function upRender(cat){
  var st=upState[cat],list=$('up-list-'+cat),btn=$('up-btn-'+cat);
  if(!st||!list)return;

  list.innerHTML='';

  // Already-uploaded files, shown as confirmed and not removable
  st.done.forEach(function(name){
    var row=document.createElement('div');
    row.className='up-item ok';
    row.innerHTML='<span class="up-item-ico">\u2713</span><span class="up-item-n"></span>';
    row.querySelector('.up-item-n').textContent=name;
    list.appendChild(row);
  });

  // Queued files, still removable
  st.sel.forEach(function(f,i){
    var row=document.createElement('div');
    row.className='up-item';
    row.innerHTML='<span class="up-item-ico">'+upFileIcon(f)+'</span>'+
      '<span class="up-item-n"></span>'+
      '<span class="up-item-s">'+upFmtSize(f.size)+'</span>'+
      '<button type="button" class="up-item-x">\u00d7</button>';
    row.querySelector('.up-item-n').textContent=f.name;
    var x=row.querySelector('.up-item-x');
    x.title=t('upRemove');
    x.addEventListener('click',function(){upRemove(cat,i);});
    list.appendChild(row);
  });

  if(btn){
    btn.disabled=st.sel.length===0||st.busy;
    btn.textContent=st.sel.length
      ?t('upBtn')(st.sel.length)
      :(st.done.length?t('upBtnMore'):t('upBtnIdle'));
  }

  var done=$('up-done-'+cat);
  if(done)done.classList.toggle('on',st.done.length>0);
  if(st.done.length){
    var dt=$('up-donet-'+cat),db=$('up-doneb-'+cat);
    if(dt)dt.textContent=t('upDoneTitle')(st.done.length);
    if(db)db.textContent=t('upDoneBody');
  }

  // Any successful upload clears the "you haven't uploaded anything" nudge
  if(st.done.length){
    var w=$('up-warn-'+cat);
    if(w)w.classList.remove('on');
  }

  upSyncSummary();
  sendHeight();
}

function upToBase64(file){
  return new Promise(function(resolve,reject){
    var r=new FileReader();
    r.onload=function(){resolve(String(r.result).split(',')[1]);};
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}

function upSend(cat){
  var st=upState[cat];
  if(!st||st.busy||!st.sel.length)return;

  var biz=upBiz();
  if(!biz){upStatus(cat,t('upErrNoBiz'));return;}

  st.busy=true;
  upStatus(cat,'');

  var btn=$('up-btn-'+cat),prog=$('up-prog-'+cat),fill=$('up-fill-'+cat),ptxt=$('up-progtxt-'+cat);
  if(btn)btn.disabled=true;
  if(prog)prog.style.display='block';
  if(fill)fill.style.width='0%';

  var queue=st.sel.slice(),total=queue.length,i=0,failed=[];

  function step(){
    if(i>=total){finish();return;}
    var file=queue[i];
    if(ptxt)ptxt.textContent=t('upProgress')(i+1,total,file.name);
    upToBase64(file).then(function(b64){
      return fetch(UPLOAD_ENDPOINT,{
        method:'POST',
        // text/plain keeps this a "simple" request, so no CORS preflight —
        // Apps Script doesn't answer OPTIONS. It reads the raw body regardless.
        headers:{'Content-Type':'text/plain'},
        body:JSON.stringify({
          businessName:biz,
          category:UP_DRIVE_LABEL[cat]||cat,
          fileName:file.name,
          mimeType:file.type||'application/octet-stream',
          data:b64
        })
      }).then(function(r){return r.json();});
    }).then(function(j){
      if(j&&j.status==='ok')st.done.push(file.name);
      else failed.push(file.name);
    }).catch(function(){
      failed.push(file.name);
    }).then(function(){
      i++;
      if(fill)fill.style.width=Math.round(i/total*100)+'%';
      step();
    });
  }

  function finish(){
    st.busy=false;
    // Keep only the files that failed, so the retry is one click
    st.sel=queue.filter(function(f){return failed.indexOf(f.name)>-1;});
    setTimeout(function(){if(prog)prog.style.display='none';},400);
    if(failed.length)upStatus(cat,t('upErrFailed')(failed.join(', ')));
    upRender(cat);
  }

  step();
}

// Roll every category's uploads into the two hidden fields that ride along with
// the submission, so the Sheet row shows what actually arrived.
function upSyncSummary(){
  var countF=$('up-count-field'),listF=$('up-files-field');
  if(!countF||!listF)return;
  var total=0,parts=[];
  Object.keys(upState).forEach(function(cat){
    var names=upState[cat].done;
    if(!names.length)return;
    total+=names.length;
    parts.push((UP_DRIVE_LABEL[cat]||cat)+': '+names.join('; '));
  });
  countF.value=String(total);
  listF.value=parts.join(' | ');
}

function upApplyLang(){
  Object.keys(upState).forEach(function(cat){
    var m=$('up-main-'+cat);if(m)m.innerHTML=t('upDropMain');
    var s=$('up-sub-'+cat);if(s)s.innerHTML=t('upDropSub');
    var h=$('up-hint-'+cat);if(h)h.textContent=t('upDropHint')(MAX_FILE_MB);
    var tt=$('up-tipt-'+cat);if(tt)tt.textContent=t('upTipTitle');
    var tb=$('up-tipb-'+cat);if(tb)tb.innerHTML=t('upTipBody');
    var w=$('up-warn-'+cat);if(w)w.textContent=t('upNoFilesWarn');
    upRender(cat);
  });
}

// Non-blocking nudge: the client asked for something they were meant to upload
// but hasn't uploaded anything. Per the "track, don't block" decision this never
// stops them — it just makes the gap visible before they move on.
function upNudge(cat){
  var st=upState[cat],w=$('up-warn-'+cat);
  if(!st||!w)return;
  w.classList.toggle('on',st.done.length===0);
}

function initUploaders(){
  // Hidden fields for the submission payload
  var form=$('wf');
  if(form&&!$('up-count-field')){
    var c=document.createElement('input');
    c.type='hidden';c.name='uploaded-file-count';c.id='up-count-field';c.value='0';
    form.appendChild(c);
    var l=document.createElement('input');
    l.type='hidden';l.name='uploaded-files';l.id='up-files-field';l.value='';
    form.appendChild(l);
  }

  // Swap every outbound tiiny link for an in-place uploader
  var links=[].slice.call(document.querySelectorAll('a[href*="tiiny.site"]'));
  links.forEach(function(a){
    var cat='inspiration';
    for(var wrapId in UP_BY_WRAP){
      if(a.closest('#'+wrapId)){cat=UP_BY_WRAP[wrapId];break;}
    }
    // Only one uploader per category; if a second link maps to the same one,
    // just drop the stray link.
    if(upState[cat]){a.remove();return;}
    upBuild(a,cat);
  });

  // The mockup blurb pointed at "the upload page linked above" — no such page now.
  document.querySelectorAll('[data-en]').forEach(function(el){
    if((el.getAttribute('data-en')||'').indexOf('upload page linked above')>-1){
      el.setAttribute('data-en',T.en.mockupTipBody);
      el.setAttribute('data-es',T.es.mockupTipBody);
    }
  });
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

// Domain validator — accepts spoton.com, www.spoton.com, https://spoton.com/
// Rejects subdomains beyond www, bare words with no TLD, and anything with spaces
function isValidDomain(raw){
  if(!raw)return false;
  var s=raw.trim().toLowerCase();
  s=s.replace(/^https?:\/\//,''); // strip protocol
  s=s.replace(/^www\./,''); // strip leading www
  s=s.replace(/\/.*$/,''); // strip path
  s=s.replace(/\?.*$/,''); // strip query
  // must be exactly domain.tld — one dot, valid TLD (2+ letters)
  return /^[a-z0-9][a-z0-9-]*\.[a-z]{2,}$/.test(s);
}

// About Us validator — requires 150+ chars AND at least 2 sentences
function isValidAbout(raw){
  if(!raw)return false;
  var s=raw.trim();
  if(s.length<150)return false;
  // Count sentence-ending punctuation followed by a space or end-of-string
  var sentences=(s.match(/[.!?]+(\s|$)/g)||[]).length;
  return sentences>=2;
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
    req('f-bn','bizname');req('f-ba','bizaddr');req('f-bh','bizhours');
    var aboutInp=$('about-biz'),aboutF=$('f-about'),aboutV=aboutInp?aboutInp.value:'';
    var aboutOk=isValidAbout(aboutV);
    if(aboutF)aboutF.classList.toggle('inv',!aboutOk);
    if(!aboutOk){ok=false;if(!firstBad&&aboutF)firstBad=aboutF;}
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
    if(hw&&hw.value==='Yes, I have an existing website'){
      if(!document.querySelector('input[name="domain-transfer"]:checked'))ok=false;
      // Existing website URL is required when client has an existing website
      var exUrlInp=document.querySelector('input[name="existing-url"]');
      var exUrlErr=$('existing-url-err');
      var exUrlV=exUrlInp?exUrlInp.value.trim():'';
      if(!exUrlV||!isValidDomain(exUrlV)){
        if(exUrlInp){exUrlInp.style.borderColor='#f87171';}
        if(exUrlErr){exUrlErr.style.display='block';}
        ok=false;
        if(!firstBad&&exUrlInp)firstBad=exUrlInp;
      } else {
        if(exUrlInp){exUrlInp.style.borderColor='';}
        if(exUrlErr){exUrlErr.style.display='none';}
      }
      // Non-blocking: they said they'd send us new content but uploaded nothing
      var ucSel=document.querySelector('input[name="use-existing-content"]:checked');
      if(ucSel&&ucSel.value.indexOf('provide')>-1)upNudge('content');
    }
    else if(hw){
      if(!document.querySelector('input[name="has-domain"]:checked'))ok=false;
      var hd=document.querySelector('input[name="has-domain"]:checked');
      if(hd&&hd.value==='Yes, I already have a domain'&&!document.querySelector('input[name="domain-transfer"]:checked'))ok=false;
      // Existing domain name is required when client already owns a domain
      if(hd&&hd.value==='Yes, I already have a domain'){
        var domNameInp=document.querySelector('input[name="domain-name"]');
        var domNameErr=$('domain-name-err');
        var domNameV=domNameInp?domNameInp.value.trim():'';
        if(!domNameV||!isValidDomain(domNameV)){
          if(domNameInp){domNameInp.style.borderColor='#f87171';}
          if(domNameErr){domNameErr.style.display='block';}
          ok=false;
          if(!firstBad&&domNameInp)firstBad=domNameInp;
        } else {
          if(domNameInp){domNameInp.style.borderColor='';}
          if(domNameErr){domNameErr.style.display='none';}
        }
      }
      // CHANGE 2: Preferred domain name is required when user wants SpotOn to register one
      if(hd&&hd.value==='No, I need one (included in subscription)'){
        var prefInp=document.querySelector('input[name="domain-preferred"]');
        var prefErr=$('domain-preferred-err');
        var prefV=prefInp?prefInp.value.trim():'';
        if(!prefV||!isValidDomain(prefV)){
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
    var hasLogoOk=!!document.querySelector('input[name="has-logo"]:checked');
    var hasLogoErr=$('has-logo-err');
    if(!hasLogoOk){
      if(hasLogoErr)hasLogoErr.style.display='block';
      ok=false;
      if(!firstBad&&hasLogoErr)firstBad=hasLogoErr;
    } else if(hasLogoErr){
      hasLogoErr.style.display='none';
    }
    var logoVal=document.querySelector('input[name="has-logo"]:checked');
    // Non-blocking: they said they have a logo but never uploaded it
    if(logoVal&&logoVal.value.indexOf('have a logo')>-1)upNudge('logo');
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
    // If "Other" is checked, the accompanying text field is required too
    var colorsOtherCb=$('colors-other-cb');
    var colorsOtherInp=$('colors-other-text');
    var colorsOtherErr=$('colors-other-err');
    if(colorsOtherCb&&colorsOtherCb.checked){
      var colorsOtherV=colorsOtherInp?colorsOtherInp.value.trim():'';
      if(!colorsOtherV){
        if(colorsOtherInp)colorsOtherInp.style.borderColor='#f87171';
        if(colorsOtherErr)colorsOtherErr.style.display='block';
        ok=false;
        if(!firstBad&&colorsOtherInp)firstBad=colorsOtherInp;
      } else {
        if(colorsOtherInp)colorsOtherInp.style.borderColor='';
        if(colorsOtherErr)colorsOtherErr.style.display='none';
      }
    } else if(colorsOtherErr){
      colorsOtherErr.style.display='none';
    }
    var vibeOk=!!document.querySelector('input[name="vibe"]:checked');
    var vibeErr=$('vibe-err');
    if(!vibeOk){if(vibeErr)vibeErr.style.display='block';ok=false;if(!firstBad&&vibeErr)firstBad=vibeErr;}else{if(vibeErr)vibeErr.style.display='none';}
    // CHANGE 3: Inspiration field is required — show nudge dialog if empty and not yet dismissed
    // Files uploaded to the inspiration drop zone count as an answer.
    var inspVal=document.querySelector('textarea[name="inspiration-urls"]');
    var inspErr=$('inspiration-err');
    var inspUploaded=upState.inspiration&&upState.inspiration.done.length>0;
    if(inspVal&&!inspVal.value.trim()&&!inspUploaded&&!inspirationNudgeDismissed){
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

    // Non-blocking: they chose to supply their own images but uploaded none
    var iuCb=$('images-upload-cb');
    if(iuCb&&iuCb.checked)upNudge('photos');

    var pagesErr=$('pages-err'),pagesOk=!!document.querySelectorAll('.pcb:checked').length;
    if(pagesErr)pagesErr.style.display=pagesOk?'none':'block';
    if(!pagesOk){ok=false;if(!firstBad&&pagesErr)firstBad=pagesErr;}

    var mc=document.querySelector('input[name="page-menu"]');
    var menuTypeErr=$('menu-type-err');
    if(mc&&mc.checked){
      var menuTypeOk=!!document.querySelector('input[name="menu-type"]:checked');
      if(menuTypeErr)menuTypeErr.style.display=menuTypeOk?'none':'block';
      if(!menuTypeOk){ok=false;if(!firstBad&&menuTypeErr)firstBad=menuTypeErr;}
      // Non-blocking: menu-as-image was chosen but no menu file arrived
      var mt=document.querySelector('input[name="menu-type"]:checked');
      if(mt&&mt.value.indexOf('image')>-1)upNudge('menu');
    } else if(menuTypeErr){
      menuTypeErr.style.display='none';
    }
  }
  if(cur===5){
    var tpP=[['tp-ordering-cb','tp-ordering-url'],['tp-res-cb','tp-res-url'],['tp-gc-cb','tp-gc-url'],['tp-loyalty-cb','tp-loyalty-url'],['tp-other-cb','tp-other-text']];
    tpP.forEach(function(p){var cb=$(p[0]),inp=$(p[1]);if(!cb||!inp)return;if(cb.checked&&!inp.value.trim()){inp.classList.add('err-inp');ok=false;}else{inp.classList.remove('err-inp');}});
  }
  if(cur===6){
    if(needNewDomain){
      var apOk=!!document.querySelector('input[name="autopublish"]:checked');
      var apErr=$('autopublish-err');
      if(!apOk){
        if(apErr)apErr.style.display='block';
        ok=false;
        if(!firstBad&&apErr)firstBad=apErr;
      } else if(apErr){
        apErr.style.display='none';
      }
    }
    if(!$('terms-agreed').checked){$('terms-opt').style.borderColor='#f87171';$('terms-err').style.display='block';ok=false;if(!firstBad)firstBad=$('terms-opt');}
    else{$('terms-opt').style.borderColor='#e0e3e9';$('terms-err').style.display='none';}
  }
  if(!ok&&firstBad){setTimeout(function(){firstBad.scrollIntoView({behavior:'smooth',block:'center'});},80);}
  return ok;
}

function goNext(){
  if(!validate())return;
  cur++;
  if(cur>maxStep)maxStep=cur;
  showStep(cur);scrollToTop();sendHeight();
}
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
  // Styles for everything form.js builds at runtime — the uploaders and the
  // stepper's forward-navigable state.
  injectRuntimeCSS();

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
      if(!hw){var exUrlInp2=document.querySelector('input[name="existing-url"]');if(exUrlInp2)exUrlInp2.style.borderColor='';if($('existing-url-err'))$('existing-url-err').style.display='none';}
      hide('transfer-code-wrap');
      document.querySelectorAll('input[name="domain-transfer"]').forEach(function(i){i.checked=false;});
      document.querySelectorAll('#dt-group .ro').forEach(function(o){o.classList.remove('sel');});
      if(!hw)hide('domain-owned-wrap');
      // Reset the domain sub-questions either way. Switching TO "yes, I have an
      // existing website" used to leave a stale "I need a domain" answer behind,
      // which kept needNewDomain true — so step 6 still demanded an auto-publish
      // answer for a domain we don't control, on a question that was hidden.
      resetDomainAnswers();
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
      if(!owns){var domNameInp2=document.querySelector('input[name="domain-name"]');if(domNameInp2)domNameInp2.style.borderColor='';if($('domain-name-err'))$('domain-name-err').style.display='none';}
      if(!needs){var domPrefInp2=document.querySelector('input[name="domain-preferred"]');if(domPrefInp2)domPrefInp2.style.borderColor='';if($('domain-preferred-err'))$('domain-preferred-err').style.display='none';}
      // Auto-publish is only offered when SpotOn is registering the domain.
      // Switching away from that clears the question AND any answer already
      // given, so a stale "yes, auto-publish" can't ride along in the payload.
      if(needs){needNewDomain=true;show('autopublish-wrap');}
      else resetAutopublish();
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
      // Clear the has-logo error once any option is picked
      if($('has-logo-err'))$('has-logo-err').style.display='none';
      // "Same colors as my logo" only makes sense if the client has (or will have) a logo.
      // Hide the option and uncheck it when they pick "No logo, just text".
      var hasNoLogo=r.value==='No logo, just text'&&r.checked;
      var colorsLogoOpt=$('colors-logo-opt');
      var colorsLogoCb=$('colors-logo-cb');
      if(colorsLogoOpt)colorsLogoOpt.style.display=hasNoLogo?'none':'';
      if(hasNoLogo&&colorsLogoCb&&colorsLogoCb.checked){
        colorsLogoCb.checked=false;
        colorsLogoOpt.classList.remove('sel');
      }
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
  on($('colors-other-cb'),'change',function(){
    tog('colors-other-wrap',this.checked);
    $('colors-other-opt').classList.toggle('sel',this.checked);
    if($('colors-err'))$('colors-err').style.display='none';
    if(!this.checked){
      var cot=$('colors-other-text'),coe=$('colors-other-err');
      if(cot)cot.style.borderColor='';
      if(coe)coe.style.display='none';
    }
    sendHeight();
  });
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
  document.querySelectorAll('input[name="autopublish"]').forEach(function(r){on(r,'change',function(){selRG('autopublish-group',r);if($('autopublish-err'))$('autopublish-err').style.display='none';});});
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

  var domPrefInp=document.querySelector('input[name="domain-preferred"]');
  if(domPrefInp){
    domPrefInp.addEventListener('input',function(){
      if(domPrefInp.value.trim()){
        domPrefInp.style.borderColor='';
        var domPrefErr=$('domain-preferred-err');
        if(domPrefErr)domPrefErr.style.display='none';
      }
    });
  }

  var domNameInp3=document.querySelector('input[name="domain-name"]');
  if(domNameInp3){
    domNameInp3.addEventListener('input',function(){
      if(domNameInp3.value.trim()){
        domNameInp3.style.borderColor='';
        var domNameErr3=$('domain-name-err');
        if(domNameErr3)domNameErr3.style.display='none';
      }
    });
  }

  var exUrlInp3=document.querySelector('input[name="existing-url"]');
  if(exUrlInp3){
    exUrlInp3.addEventListener('input',function(){
      if(exUrlInp3.value.trim()){
        exUrlInp3.style.borderColor='';
        var exUrlErr3=$('existing-url-err');
        if(exUrlErr3)exUrlErr3.style.display='none';
      }
    });
  }

  var colorsOtherInp2=$('colors-other-text');
  if(colorsOtherInp2){
    colorsOtherInp2.addEventListener('input',function(){
      if(colorsOtherInp2.value.trim()){
        colorsOtherInp2.style.borderColor='';
        var coe2=$('colors-other-err');
        if(coe2)coe2.style.display='none';
      }
    });
  }

  // About Us — clear inv state as user types once it meets the bar
  var aboutInp2=$('about-biz');
  if(aboutInp2){
    aboutInp2.addEventListener('input',function(){
      if(isValidAbout(aboutInp2.value)){
        var f=$('f-about');
        if(f)f.classList.remove('inv');
      }
    });
  }

  // About Us examples modal
  var examplesBtn=$('about-examples-btn'),examplesModal=$('about-examples-modal'),examplesClose=$('about-examples-close');
  if(examplesBtn&&examplesModal){
    on(examplesBtn,'click',function(){examplesModal.classList.add('show');});
  }
  if(examplesClose&&examplesModal){
    on(examplesClose,'click',function(){examplesModal.classList.remove('show');});
  }
  if(examplesModal){
    on(examplesModal,'click',function(e){if(e.target===examplesModal)examplesModal.classList.remove('show');});
  }

  // Replace the outbound tiiny.site upload links with in-place drop zones
  initUploaders();
}

// Google Apps Script Web App endpoint (deployed from the destination Sheet).
var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxTygdTb8bE9iCel3gU9ddlYZT2im_aMhTQuTr18Lx_sAS-LWhkmKhoOhP0DlYnsiSrfA/exec';

var isSubmitting = false;
document.getElementById('wf').addEventListener('submit', function(e) {
  e.preventDefault();
  if (isSubmitting) return; // hard guard against multi-clicks
  if (!validate()) return;

  // Don't let a submission race an upload that's still running
  var stillUploading = Object.keys(upState).some(function(c){ return upState[c].busy; });
  if (stillUploading) {
    alert(lang === 'es'
      ? 'Sus archivos todav\u00eda se est\u00e1n subiendo. Por favor espere unos segundos e intente de nuevo.'
      : 'Your files are still uploading. Please wait a few seconds and try again.');
    return;
  }

  isSubmitting = true;
  var form = this;
  var btn = $('btnSubmit');
  btn.disabled = true;
  btn.querySelector('span').textContent = lang === 'es' ? 'Enviando\u2026' : 'Sending\u2026';

  // Make sure the upload summary fields reflect the final state
  upSyncSummary();

  // Guarantee this client has a Drive folder even if they uploaded nothing, so
  // the team can drop assets in and the analyzer's recap doc has a home.
  // Fired alongside the submission rather than after it: the page navigates
  // away on success, which would cancel an in-flight request. Best-effort —
  // a failure here must never block the submission.
  var bizForFolder = upBiz();
  if (bizForFolder) {
    try {
      fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ businessName: bizForFolder, ensureFolder: true })
      }).catch(function(){});
    } catch (err) {}
  }

  // Show the full-screen loading overlay
  var overlay = document.getElementById('loading-overlay');
  var loadingMsg = document.getElementById('loading-msg');
  var loadingContent = document.getElementById('loading-content');
  if (loadingMsg) loadingMsg.textContent = lang === 'es' ? 'Enviando su cuestionario\u2026' : 'Sending your questionnaire\u2026';
  if (loadingContent && btn) {
    // Position the loading content right where the submit button is — the user just
    // clicked it, so we know it's in their viewport. Since the form is embedded via
    // iframe in Webflow with auto-height, position:fixed centering doesn't work as
    // expected — we place the content at the button's document Y instead.
    var el = btn, top = 0;
    while (el) { top += el.offsetTop; el = el.offsetParent; }
    // Position ~140px above the button so the spinner sits comfortably in view.
    loadingContent.style.top = Math.max(60, top - 140) + 'px';
  }
  if (overlay) overlay.classList.add('show');

  // Build a plain object from the form. For checkboxes, an unchecked box
  // simply won't appear in FormData, so the Sheet cell stays blank.
  var fd = new FormData(form);
  var payload = {};
  fd.forEach(function(value, key) {
    // Handle repeated keys (multi-select checkboxes) by joining with "; "
    if (payload[key] != null) {
      payload[key] = payload[key] + '; ' + value;
    } else {
      payload[key] = value;
    }
  });
  payload._lang = lang;

  function fail() {
    isSubmitting = false;
    if (overlay) overlay.classList.remove('show');
    btn.disabled = false;
    btn.querySelector('span').textContent = lang === 'es' ? 'Enviar cuestionario' : 'Submit questionnaire';
    alert(lang === 'es' ? 'Hubo un error al enviar. Por favor intente de nuevo.' : 'There was an error submitting. Please try again.');
  }

  fetch(FORM_ENDPOINT, {
    method: 'POST',
    // No custom Content-Type header — that would trigger a CORS preflight
    // that Apps Script doesn't handle. text/plain is the sweet spot;
    // Apps Script reads e.postData.contents as the raw string either way.
    body: JSON.stringify(payload)
  }).then(function(r){
    return r.text().then(function(txt){
      var j;
      try { j = JSON.parse(txt); } catch(e) { j = {}; }
      return { ok: r.ok && j.ok !== false, json: j };
    });
  }).then(function(res) {
    if (res.ok) {
      // Keep overlay visible during redirect so no flash of empty page
      window.location.href = 'https://andresaromeroa1985.github.io/sd-wdd-wq/thanks.html?lang=' + lang;
    } else {
      fail();
    }
  }).catch(fail);
});

setup();
applyLang();
showStep(1);
sendHeight();
