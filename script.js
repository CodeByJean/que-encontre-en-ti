const cardsContainer = document.querySelector('#cards');
const template = document.querySelector('#card-template');
const progressText = document.querySelector('#progress-text');
const progressBar = document.querySelector('#progress-bar');
const celebration = document.querySelector('#celebration');

async function loadMessages() {
  try {
    const response = await fetch('messages.json');
    if (!response.ok) throw new Error(`No se pudo cargar messages.json (${response.status})`);
    const messages = await response.json();
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('messages.json no contiene mensajes.');
    renderCards(messages);
  } catch (error) {
    cardsContainer.innerHTML = '<p class="load-error">No pudimos cargar las razones. Comprueba que la página se esté ejecutando desde un servidor local.</p>';
    console.error(error);
  }
}

function renderCards(messages) {
  let openedCards = 0;
  const totalCards = messages.length;

  progressText.textContent = `0 de ${totalCards} tarjetas abiertas`;
  messages.forEach((item, index) => {
    const card = template.content.cloneNode(true).querySelector('.reason-card');
    card.querySelector('.card-number').textContent = String(index + 1).padStart(2, '0');
    card.querySelector('.card-back').textContent = item.message ?? item;
    card.setAttribute('aria-label', `Abrir razón ${index + 1}`);

    card.addEventListener('click', () => {
      if (card.classList.contains('is-open')) return;
      card.classList.add('is-open');
      card.setAttribute('aria-label', `Razón ${index + 1}: ${item.message ?? item}`);
      openedCards += 1;
      progressText.textContent = `${openedCards} de ${totalCards} tarjetas abiertas`;
      progressBar.style.width = `${(openedCards / totalCards) * 100}%`;

      if (openedCards === totalCards) showCelebration();
    });
    cardsContainer.append(card);
  });

  function showCelebration() {
    setTimeout(() => {
      cardsContainer.setAttribute('aria-hidden', 'true');
      cardsContainer.classList.add('is-complete');
      document.querySelector('.hero').classList.add('is-hidden');
      celebration.classList.add('is-visible');
      celebration.setAttribute('aria-hidden', 'false');
      celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  }
}

loadMessages();

// Crea un rastro de corazones al mover el puntero o deslizar el dedo.
const heartTrail = document.querySelector('#heart-trail');
let lastHeartTime = 0;

function createTrailHeart(x, y) {
  const now = Date.now();
  if (now - lastHeartTime < 70) return;
  lastHeartTime = now;

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
  if (event.pointerType === 'mouse' || event.pointerType === 'touch') {
    createTrailHeart(event.clientX, event.clientY);
  }
});

// Evita que el navegador intente seleccionar o arrastrar contenido durante el gesto.
document.addEventListener('selectstart', (event) => event.preventDefault());
document.addEventListener('dragstart', (event) => event.preventDefault());
