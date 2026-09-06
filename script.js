const cardsContainer = document.querySelector('#cards');
const template = document.querySelector('#card-template');
const progressText = document.querySelector('#progress-text');
const progressBar = document.querySelector('#progress-bar');
const celebration = document.querySelector('#celebration');
const spotifyFrame = document.querySelector('.spotify-player iframe');
const nextStep = document.querySelector('#next-step');
const nextStepButton = document.querySelector('#next-step-button');

async function loadDiscoveries() {
  try {
    const response = await fetch('messages.json');
    if (!response.ok) throw new Error(`No se pudo cargar messages.json (${response.status})`);
    const discoveries = await response.json();
    if (!Array.isArray(discoveries) || discoveries.length === 0) throw new Error('No hay descubrimientos registrados.');
    renderDiscoveries(discoveries);
  } catch (error) {
    cardsContainer.innerHTML = '<p class="record-message">La exploración no pudo iniciarse. Intenta abrir el proyecto desde un servidor local.</p>';
    console.error(error);
  }
}

function renderDiscoveries(discoveries) {
  let opened = 0;
  const total = discoveries.length;
  progressText.textContent = `0 / ${total}`;

  discoveries.forEach((discovery, index) => {
    const card = template.content.cloneNode(true).querySelector('.record-card');
    const trigger = card.querySelector('.record-trigger');
    card.querySelector('.record-index').textContent = `0${index + 1}`;
    card.querySelector('.record-type').textContent = discovery.type;
    card.querySelector('.record-title').textContent = discovery.title;
    card.querySelector('.record-message').textContent = discovery.message;
    card.querySelector('.record-note').textContent = discovery.note;
    trigger.setAttribute('aria-label', `Abrir ${discovery.title}`);

    trigger.addEventListener('click', () => {
      if (card.classList.contains('is-open')) return;
      card.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-label', `Cerrado: ${discovery.title}`);
      opened += 1;
      progressText.textContent = `${opened} / ${total}`;
      progressBar.style.width = `${(opened / total) * 100}%`;

      if (opened === total) unlockResult();
    });
    cardsContainer.append(card);
  });

  function unlockResult() {
    nextStep.hidden = false;
    nextStep.classList.add('is-ready');
    nextStepButton.focus({ preventScroll: true });
  }
}

nextStepButton.addEventListener('click', () => {
  nextStep.classList.add('is-opening');
  nextStepButton.disabled = true;
  setTimeout(() => {
    celebration.setAttribute('aria-hidden', 'false');
    celebration.classList.add('is-visible');
    if (spotifyFrame) {
      const spotifyUrl = new URL(spotifyFrame.dataset.src);
      spotifyUrl.searchParams.set('autoplay', '1');
      spotifyFrame.src = spotifyUrl.toString();
    }
    celebration.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 650);
});

loadDiscoveries();

const heartRain = document.querySelector('#heart-rain');
const rainHeartCount = 16;

for (let index = 0; index < rainHeartCount; index += 1) {
  const heart = document.createElement('span');
  heart.className = 'heart-rain-heart';
  heart.textContent = index % 4 === 0 ? '♡' : '♥';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.setProperty('--size', `${10 + Math.random() * 10}px`);
  heart.style.setProperty('--duration', `${12 + Math.random() * 10}s`);
  heart.style.setProperty('--delay', `${Math.random() * -18}s`);
  heart.style.setProperty('--drift', `${Math.round(Math.random() * 100 - 50)}px`);
  heartRain.append(heart);
}

// El rastro queda reservado para puntero de escritorio para no interferir con el scroll táctil.
const heartTrail = document.querySelector('#heart-trail');
let lastHeartTime = 0;
let pendingPoint = null;
let animationFrame = null;
const maxTrailHearts = 18;

function createTrailHeart(x, y) {
  const now = performance.now();
  if (now - lastHeartTime < 110) return;
  lastHeartTime = now;

  while (heartTrail.childElementCount >= maxTrailHearts) heartTrail.firstElementChild.remove();

  const heart = document.createElement('span');
  heart.className = 'trail-heart';
  heart.textContent = Math.random() > 0.35 ? '♥' : '♡';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty('--drift', `${Math.round(Math.random() * 50 - 25)}px`);
  heartTrail.append(heart);
  heart.addEventListener('animationend', () => heart.remove(), { once: true });
}

document.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse') return;
  pendingPoint = { x: event.clientX, y: event.clientY };
  if (animationFrame) return;

  animationFrame = requestAnimationFrame(() => {
    if (pendingPoint) createTrailHeart(pendingPoint.x, pendingPoint.y);
    pendingPoint = null;
    animationFrame = null;
  });
});
