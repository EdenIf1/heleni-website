(function(){
  var items=[].slice.call(document.querySelectorAll('#bento .item'));
  document.querySelectorAll('.filters button').forEach(function(b){
    b.addEventListener('click',function(){
      var f=b.dataset.f;
      document.querySelectorAll('.filters button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
      items.forEach(function(p){p.hidden=!(f==='all'||p.dataset.c===f)});
    });
  });

  var dlg=document.getElementById('lightbox'),img=document.getElementById('lb-img'),cap=document.getElementById('lb-cap'),cur=0;
  function visible(){return items.filter(function(i){return !i.hidden})}
  function show(i){var v=visible();cur=(i+v.length)%v.length;var el=v[cur],im=el.querySelector('img');
    img.src=im.src;img.alt=im.alt;cap.textContent=el.querySelector('.cap b').textContent+' · '+el.querySelector('.cap span').textContent;}
  items.forEach(function(el){el.addEventListener('click',function(){show(visible().indexOf(el));
    if(dlg.showModal){dlg.showModal()}else{dlg.setAttribute('open','')}})});
  document.getElementById('lb-next').addEventListener('click',function(){show(cur+1)});
  document.getElementById('lb-prev').addEventListener('click',function(){show(cur-1)});
  document.getElementById('lb-close').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  dlg.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(cur+1);if(e.key==='ArrowRight')show(cur-1)});

  var mb=document.querySelector('.menu-btn'),mn=document.getElementById('mnav'),mx=mn.querySelector('.x');
  function menu(open){mn.classList.toggle('open',open);mb.setAttribute('aria-expanded',open?'true':'false');
    document.body.style.overflow=open?'hidden':'';(open?mx:mb).focus();}
  mb.addEventListener('click',function(){menu(true)});
  mx.addEventListener('click',function(){menu(false)});
  mn.querySelectorAll('a.l').forEach(function(a){a.addEventListener('click',function(){menu(false)})});
  mn.addEventListener('keydown',function(e){
    if(e.key==='Escape')menu(false);
    if(e.key==='Tab'){var f=mn.querySelectorAll('a,button'),first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  });

  document.querySelectorAll('a[href="#accessibility"],a[href="#privacy"],a[href="#terms"]').forEach(function(a){
    a.addEventListener('click',function(){var d=document.querySelector(a.getAttribute('href'));if(d)d.open=true;});
  });
  document.getElementById('qf').addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(id){return document.getElementById(id).value.trim()};
    var t='שלום דניאל, הגעתי מהאתר.\nשם: '+v('q-name')+'\nטלפון: '+v('q-phone')+'\nמה צריך: '+v('q-type')+'\nעיר: '+v('q-city')+(v('q-msg')?'\nפרטים: '+v('q-msg'):'');
    document.getElementById('q-link').href='https://wa.me/972523298795?text='+encodeURIComponent(t);
    document.getElementById('q-ok').hidden=false;
  });
})();