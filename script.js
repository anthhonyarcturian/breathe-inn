(() => {
  const links = Array.from(document.querySelectorAll('.side-nav-link'));
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const sideNav = document.querySelector('.side-nav');
  const closeMobileMenu = () => {
    sideNav?.classList.remove('mobile-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileToggle?.setAttribute('aria-label', 'Open navigatiemenu');
    if (mobileToggle) mobileToggle.querySelector('.mobile-menu-text').textContent = 'Menu';
    if (mobileToggle) mobileToggle.querySelector('.mobile-menu-icon').textContent = '☰';
  };
  mobileToggle?.addEventListener('click', () => {
    const isOpen = sideNav.classList.toggle('mobile-open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileToggle.setAttribute('aria-label', isOpen ? 'Sluit navigatiemenu' : 'Open navigatiemenu');
    mobileToggle.querySelector('.mobile-menu-text').textContent = isOpen ? 'Sluiten' : 'Menu';
    mobileToggle.querySelector('.mobile-menu-icon').textContent = isOpen ? '×' : '☰';
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
  document.addEventListener('click', e => {
    if (sideNav?.classList.contains('mobile-open') && !sideNav.contains(e.target) && !mobileToggle.contains(e.target)) closeMobileMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMobileMenu(); });
  const states = ['home','ademwerk','sessie','over','contact'];
  const groupFor = {
    home:'home', ademcoaching:'ademwerk', ademwerk:'ademwerk',
    sessie:'sessie', veiligheid:'sessie', over:'over', ervaringen:'over', contact:'contact'
  };
  let lockUntil = 0;

  function activate(state){
    if (!states.includes(state)) state='home';
    links.forEach((link,index)=>link.classList.toggle('active',states[index]===state));
  }

  links.forEach((link,index)=>{
    link.addEventListener('click',event=>{
      event.preventDefault();
      const id=link.getAttribute('href').slice(1);
      const target=document.getElementById(id);
      if(!target) return;
      activate(states[index]);
      closeMobileMenu();
      lockUntil=performance.now()+800;
      target.scrollIntoView({behavior:'smooth',block:'start'});
      history.replaceState(null,'','#'+id);
    });
  });

  const sections=Array.from(document.querySelectorAll('main section[id]'));
  function syncFromScroll(){
    if(performance.now()<lockUntil) return;
    const marker=innerHeight*0.42;
    let chosen=sections[0];
    for(const section of sections){
      if(section.getBoundingClientRect().top<=marker) chosen=section;
      else break;
    }
    activate(groupFor[chosen?.id]||'home');
  }
  let queued=false;
  addEventListener('scroll',()=>{
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{syncFromScroll();queued=false;});
  },{passive:true});
  addEventListener('resize',syncFromScroll);
  addEventListener('load',()=>{
    const hash=location.hash.slice(1);
    activate(groupFor[hash]||'home');
    syncFromScroll();
  });
  activate(groupFor[location.hash.slice(1)]||'home');
})();
