/* ==================================================================
   DR. LEONARDO ALVES BEZERRA — ADVOCACIA
   Script principal (JavaScript puro, sem dependências)
   Sumário:
   1. Menu responsivo (hambúrguer)
   2. Navbar mudando de cor ao rolar a página
   3. Scroll suave + destaque do link ativo
   4. Botão voltar ao topo
   5. Animações ao rolar a página (IntersectionObserver)
   6. FAQ em accordion
   7. Slider de avaliações automático
   8. Ano dinâmico no rodapé
================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. MENU RESPONSIVO ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav__link');

  function openMenu() {
    nav.classList.add('is-active');
    navOverlay.classList.add('is-active');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    nav.classList.remove('is-active');
    navOverlay.classList.remove('is-active');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-active');
    isOpen ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ---------- 2. NAVBAR AO ROLAR A PÁGINA ---------- */
  const header = document.getElementById('header');

  function toggleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  toggleHeaderScroll();
  window.addEventListener('scroll', toggleHeaderScroll, { passive: true });

  /* ---------- 3. DESTAQUE DO LINK ATIVO NO MENU ---------- */
  const sections = document.querySelectorAll('main section[id], main[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(section => navObserver.observe(section));

  /* ---------- 4. BOTÃO VOLTAR AO TOPO ---------- */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 5. ANIMAÇÕES AO ROLAR (FADE-IN) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // pequeno atraso escalonado para os cards aparecerem em sequência
        const delay = (index % 6) * 70;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 6. FAQ EM ACCORDION ---------- */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // fecha os outros itens abertos
      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 7. SLIDER DE AVALIAÇÕES ---------- */
  const track = document.getElementById('reviewsTrack');
  const dotsContainer = document.getElementById('reviewsDots');

  if (track) {
    const slides = Array.from(track.children);
    const dots = [];
    let current = 0;
    let autoplayTimer = null;

    // cria os indicadores (dots) dinamicamente
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Ver avaliação ${index + 1}`);
      if (index === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });

    function goToSlide(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach(d => d.classList.remove('is-active'));
      dots[current].classList.add('is-active');
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    startAutoplay();

    // pausa o slider automático quando o usuário interage
    const sliderWrapper = document.getElementById('reviewsSlider');
    sliderWrapper.addEventListener('mouseenter', stopAutoplay);
    sliderWrapper.addEventListener('mouseleave', startAutoplay);
    sliderWrapper.addEventListener('touchstart', stopAutoplay, { passive: true });
  }

  /* ---------- 8. ANO DINÂMICO NO RODAPÉ ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
