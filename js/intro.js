(() => {
  const intro = document.getElementById('intro');
  const shell = document.getElementById('site-shell');
  const envelope = intro.querySelector('.envelope');
  const letter = intro.querySelector('.letter');
  const art = intro.querySelector('.open-envelope-art');
  const video = document.getElementById('jordan-video');
  const videoToggle = document.querySelector('.hero-video-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let returnFocus;

  function updateVideoToggle() {
    videoToggle.textContent = video.paused ? 'تشغيل الفيديو' : 'إيقاف الفيديو';
  }

  function playVideo() {
    video.play().catch(updateVideoToggle);
  }

  video.addEventListener('play', updateVideoToggle);
  video.addEventListener('pause', updateVideoToggle);
  videoToggle.onclick = () => {
    if (video.paused) playVideo();
    else video.pause();
  };

  function enter() {
    if (intro.classList.contains('leaving')) return;
    clearTimeout(timer);
    intro.classList.add('leaving');
    timer = setTimeout(() => {
      intro.hidden = true;
      document.body.classList.remove('intro-active');
      shell.inert = false;
      playVideo();
      const target = returnFocus || document.querySelector('.hero h1');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      returnFocus = null;
    }, reducedMotion.matches ? 0 : 450);
  }

  function open() {
    envelope.disabled = true;
    intro.classList.add('opening');
    timer = setTimeout(() => {
      intro.classList.add('opened');
      letter.hidden = false;
      art.hidden = false;
      letter.querySelector('h1').focus({ preventScroll: true });
    }, reducedMotion.matches ? 0 : 900);
  }

  function show() {
    clearTimeout(timer);
    const active = document.activeElement;
    returnFocus = shell.contains(active) ? active : null;
    intro.hidden = false;
    intro.classList.remove('leaving', 'opening', 'opened');
    intro.scrollTop = 0;
    letter.hidden = true;
    art.hidden = true;
    envelope.disabled = false;
    shell.inert = true;
    document.body.classList.add('intro-active');
    envelope.focus({ preventScroll: true });
    video.pause();
  }

  envelope.onclick = open;
  intro.querySelector('.skip-intro').onclick = enter;
  intro.querySelector('.enter-site').onclick = enter;
  document.getElementById('replay-intro').onclick = show;

  intro.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      enter();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...intro.querySelectorAll('button:not(:disabled)')]
      .filter(button => button.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  show();
  addEventListener('pageshow', event => {
    if (event.persisted) show();
  });
})();
