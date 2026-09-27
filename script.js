(function(){
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], shooting = [];
  const STAR_COUNT = 220;
  let mx = innerWidth/2, my = innerHeight/2;

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeStars(){
    stars = [];
    for(let i=0;i<STAR_COUNT;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.4+0.3,
        z: Math.random()*0.7+0.3,
        tw: Math.random()*Math.PI*2
      });
    }
  }
  makeStars();
  window.addEventListener('resize', makeStars);
  window.addEventListener('mousemove', e=>{ mx = e.clientX; my = e.clientY; });

  function maybeShootingStar(){
    if(Math.random() < 0.006){
      shooting.push({
        x: Math.random()*w*0.6,
        y: Math.random()*h*0.3,
        vx: 6+Math.random()*5,
        vy: 3+Math.random()*2,
        life: 1
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    const px = (mx/w - 0.5), py = (my/h - 0.5);

    for(const s of stars){
      s.tw += 0.02;
      const parallax = s.z * 14;
      const sx = s.x - px*parallax;
      const sy = s.y - py*parallax;
      const alpha = 0.4 + 0.6*Math.abs(Math.sin(s.tw));
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(200,210,255,${alpha*s.z})`;
      ctx.fill();
    }

    maybeShootingStar();
    for(let i=shooting.length-1;i>=0;i--){
      const sh = shooting[i];
      ctx.beginPath();
      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x-sh.vx*8, sh.y-sh.vy*8);
      grad.addColorStop(0,'rgba(255,255,255,0.9)');
      grad.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx*8, sh.y - sh.vy*8);
      ctx.stroke();
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.012;
      if(sh.life<=0 || sh.x>w || sh.y>h) shooting.splice(i,1);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

(function(){
  const clockTime = document.getElementById('clockTime');
  function tickClock(){
    const d = new Date();
    clockTime.textContent = d.toLocaleTimeString('en-GB', {hour12:false});
  }
  tickClock(); setInterval(tickClock, 1000);

  const startTime = Date.now();
  const tUptime = document.getElementById('tUptime');
  setInterval(()=>{
    const s = Math.floor((Date.now()-startTime)/1000);
    const hh = String(Math.floor(s/3600)).padStart(2,'0');
    const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    tUptime.textContent = `${hh}:${mm}:${ss}`;
  }, 1000);

  const tCursor = document.getElementById('tCursor');
  window.addEventListener('mousemove', e=>{
    tCursor.textContent = `${e.clientX} / ${e.clientY}`;
  });

  const tScroll = document.getElementById('tScroll');
  window.addEventListener('scroll', ()=>{
    const pct = Math.min(100, Math.round((scrollY / (document.body.scrollHeight - innerHeight)) * 100)) || 0;
    tScroll.textContent = pct + '%';
  });

  const menuButton = document.getElementById('menuButton');
  const navbar = document.getElementById('navbar');
  menuButton.addEventListener('click', ()=> navbar.classList.toggle('active'));
  const navLinks = document.querySelectorAll('.navbar a');
  navLinks.forEach(link=> link.addEventListener('click', ()=> navbar.classList.remove('active')));

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', ()=>{
    let current = '';
    sections.forEach(sec=>{
      if(scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach(l=> l.classList.toggle('active', l.getAttribute('href') === '#'+current));
  });

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', ()=> backToTop.classList.toggle('show', scrollY > 400));
  backToTop.addEventListener('click', ()=> scrollTo({top:0, behavior:'smooth'}));

  const resumeModal = document.getElementById('resumeModal');
  const viewResumeBtns = document.querySelectorAll('.viewResumeBtn');
  const closeResumeModal = document.getElementById('closeResumeModal');

  viewResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
    });
  });

  closeResumeModal.addEventListener('click', () => {
    resumeModal.classList.remove('active');
  });

  resumeModal.addEventListener('click', (e) => {
    if(e.target === resumeModal) resumeModal.classList.remove('active');
  });

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if(!name || !email || !message){
      formMessage.style.color = 'var(--magenta)';
      formMessage.textContent = 'Please fill all fields.';
      return;
    }
    formMessage.style.color = 'var(--ok)';
    formMessage.textContent = 'Thank you! Your message has been submitted.';
    contactForm.reset();
  });

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
  }, {threshold:0.15});
  revealEls.forEach(el=> io.observe(el));

  const skillIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const lvl = en.target.closest('.skill-card').dataset.lvl;
        en.target.style.width = lvl + '%';
      }
    });
  }, {threshold:0.4});
  document.querySelectorAll('.skill-card .bar i').forEach(bar=> skillIO.observe(bar.closest('.skill-card')));
})();