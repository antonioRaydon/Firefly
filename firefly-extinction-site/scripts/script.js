document.documentElement.classList.add('js-ready');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const lightButton = document.querySelector('#firefly-toggle');
const lightLabel = lightButton?.querySelector('.toggle-label');
const lightStatus = document.querySelector('#firefly-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

function addFireflies(field, count, minX = 4) {
  if (!field || field.childElementCount) return;
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'firefly-particle';
    particle.style.left = `${minX + Math.random() * (95 - minX)}%`;
    particle.style.top = `${8 + Math.random() * 82}%`;
    particle.style.setProperty('--size', `${3 + Math.random() * 4}px`);
    particle.style.setProperty('--duration', `${3.2 + Math.random() * 4.5}s`);
    particle.style.setProperty('--delay', `${Math.random() * 4}s`);
    particle.style.setProperty('--drift', `${-18 + Math.random() * 36}px`);
    field.append(particle);
  }
}

const heroField = document.querySelector('.hero .firefly-field');
const helpField = document.querySelector('.help-banner .firefly-field');
addFireflies(heroField, 24, 38);
addFireflies(helpField, 18, 42);

lightButton?.addEventListener('click', () => {
  const isOn = lightButton.getAttribute('aria-pressed') === 'true';
  lightButton.setAttribute('aria-pressed', String(!isOn));
  document.body.classList.toggle('fireflies-on', !isOn);
  if (lightLabel) lightLabel.textContent = isOn ? 'Acender vaga-lumes' : 'Apagar vaga-lumes';
  if (lightStatus) lightStatus.textContent = isOn ? 'Animação dos vaga-lumes desativada.' : 'Animação dos vaga-lumes ativada.';
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const navigationLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const anchorTargets = navigationLinks
  .map((link) => ({ link, target: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.target);

if ('IntersectionObserver' in window && anchorTargets.length) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const active = link === anchorTargets.find((item) => item.target === entry.target)?.link;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
  anchorTargets.forEach(({ target }) => activeObserver.observe(target));
}

const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');
if (hero && heroImage && !reducedMotion.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let frameRequested = false;
  let pointerX = 0;
  let pointerY = 0;
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 5;
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(() => {
      heroImage.style.setProperty('--pointer-x', `${pointerX}px`);
      heroImage.style.setProperty('--pointer-y', `${pointerY}px`);
      frameRequested = false;
    });
  });
  hero.addEventListener('pointerleave', () => {
    heroImage.style.setProperty('--pointer-x', '0px');
    heroImage.style.setProperty('--pointer-y', '0px');
  });
}

const nightExperience = document.querySelector('#night-experience');
const lightSlider = document.querySelector('#light-slider');
const lightOutput = document.querySelector('#light-output');
const lightDescription = document.querySelector('#light-description');
const lightLevels = [
  { max: 24, label: 'Baixa', description: 'Apagar luzes externas quando não são necessárias ajuda a preservar a escuridão da noite.' },
  { max: 49, label: 'Moderada', description: 'Luz direcionada e menos intensa evita iluminar áreas naturais sem necessidade.' },
  { max: 74, label: 'Alta', description: 'A claridade que se espalha pelo entorno pode alterar o ambiente noturno dos habitats.' },
  { max: 100, label: 'Muito alta', description: 'A poluição luminosa pode interferir nos sinais luminosos usados por algumas espécies.' },
];

lightSlider?.addEventListener('input', () => {
  const level = Number(lightSlider.value);
  const levelInfo = lightLevels.find((item) => level <= item.max) ?? lightLevels.at(-1);
  const normalizedLevel = level / 100;
  nightExperience?.style.setProperty('--light-opacity', String(0.08 + normalizedLevel * 0.72));
  nightExperience?.style.setProperty('--firefly-opacity', String(0.95 - normalizedLevel * 0.67));
  nightExperience?.setAttribute('data-light', String(level));
  if (lightOutput) lightOutput.textContent = levelInfo.label;
  if (lightDescription) lightDescription.textContent = levelInfo.description;
});

const actionList = document.querySelector('#action-list');
const actionProgress = document.querySelector('#action-progress');
const actionProgressText = document.querySelector('#action-progress-text');
actionList?.addEventListener('change', () => {
  const total = actionList.querySelectorAll('input[type="checkbox"]').length;
  const selected = actionList.querySelectorAll('input[type="checkbox"]:checked').length;
  actionProgress?.setAttribute('aria-valuenow', String(selected));
  if (actionProgress) actionProgress.querySelector('span').style.width = `${total ? (selected / total) * 100 : 0}%`;
  if (actionProgressText) {
    actionProgressText.textContent = selected === total
      ? `${selected} de ${total} atitudes selecionadas — obrigado por cuidar da vida noturna.`
      : `${selected} de ${total} atitudes selecionadas`;
  }
});
