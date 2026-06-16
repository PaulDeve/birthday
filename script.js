const introStage = document.getElementById('introStage');
const mainStage = document.getElementById('mainStage');
const cardStage = document.getElementById('cardStage');
const finalStage = document.getElementById('finalStage');
const discoverButton = document.getElementById('discoverButton');
const burstContainer = document.getElementById('burstContainer');
const heartFloaters = document.getElementById('heartFloaters');
const rainContainer = document.getElementById('rainContainer');
const sparkCanvas = document.getElementById('sparkCanvas');
const mainTitle = document.getElementById('mainTitle');
const mainCopy = document.getElementById('mainCopy');

let canvasContext;
let sparkParticles = [];
let animationFrameId;

// Inicializa la experiencia y los efectos suaves
window.addEventListener('DOMContentLoaded', () => {
  prepareTextReveal(mainTitle, 0.04, 0.45);
  prepareTextReveal(mainCopy, 0.02, 1.0);
  initializeSparkCanvas();
  startIntroSequence();
});

// Controla el flujo de las pantallas en secuencia automática
function startIntroSequence() {
  setTimeout(() => {
    introStage.classList.remove('active');
    introStage.classList.add('hidden');
    mainStage.classList.remove('hidden');
    mainStage.classList.add('active');
  }, 2800);
}

// Crea un efecto de texto revelado letra por letra
function prepareTextReveal(element, delayStep, initialDelay) {
  const lines = element.querySelectorAll('.title-line');
  if (lines.length) {
    lines.forEach((line, lineIndex) => {
      const text = line.textContent.trim();
      const wrapped = Array.from(text).map((char, index) => {
        const delay = initialDelay + (lineIndex * text.length + index) * delayStep;
        return `<span class="char" style="animation-delay: ${delay}s">${char}</span>`;
      }).join('');
      line.innerHTML = wrapped;
    });
    return;
  }

  const text = element.textContent.trim();
  const words = text.split(' ');
  const wrapped = words.map((word, wordIndex) => {
    const letters = Array.from(word).map((char, index) => {
      const delay = initialDelay + (wordIndex * word.length + index) * delayStep;
      return `<span class="char" style="animation-delay: ${delay}s">${char}</span>`;
    }).join('');
    return `<span class="word">${letters}</span>`;
  });
  element.innerHTML = wrapped.join(' ');
}

// Evento del botón para mostrar la carta y activar la experiencia final
discoverButton.addEventListener('click', () => {
  discoverButton.disabled = true;
  createBurstEffect();
  mainStage.classList.remove('active');
  mainStage.classList.add('hidden');
  cardStage.classList.remove('hidden');
  cardStage.classList.add('active');
  heartFloaters.classList.add('active');

  setTimeout(() => {
    showFinalStage();
  }, 4200);
});

// Muestra el mensaje final épico con lluvia de luces
function showFinalStage() {
  cardStage.classList.remove('active');
  cardStage.classList.add('hidden');
  finalStage.classList.remove('hidden');
  finalStage.classList.add('active');
  createLightRain();
}

// Efecto de explosión suave con partículas brillantes
function createBurstEffect() {
  const count = 18;
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'burst-dot';
    const size = Math.random() * 10 + 6;
    const left = 50 + (Math.random() - 0.5) * 30;
    const top = 50 + (Math.random() - 0.5) * 16;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${left}%`;
    dot.style.top = `${top}%`;
    dot.style.background = `radial-gradient(circle, rgba(255, 243, 221, 1), rgba(214, 170, 118, 0.18))`;
    dot.style.animation = `burstMove 1.2s ease-out forwards`;
    dot.style.transform = `translate(-50%, -50%) scale(0.8)`;
    dot.style.opacity = '0';
    dot.style.setProperty('--burst-x', `${(Math.random() - 0.5) * 120}px`);
    dot.style.setProperty('--burst-y', `${(Math.random() - 0.5) * 80}px`);
    burstContainer.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
}

// Genera una lluvia de luces minimalista en el final épico
function createLightRain() {
  const drops = 20;
  rainContainer.innerHTML = '';
  rainContainer.classList.add('active');

  for (let i = 0; i < drops; i += 1) {
    const drop = document.createElement('span');
    drop.className = 'rain-drop';
    const width = Math.random() * 2 + 2;
    const height = Math.random() * 38 + 40;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const duration = 1.5 + Math.random() * 0.6;

    drop.style.width = `${width}px`;
    drop.style.height = `${height}px`;
    drop.style.left = `${left}%`;
    drop.style.top = `${-height}px`;
    drop.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255, 216, 178, 0.12))';
    drop.style.opacity = '0';
    drop.style.animation = `rainFall ${duration}s cubic-bezier(0.6, 0.04, 0.06, 0.94) ${delay}s forwards`;
    rainContainer.appendChild(drop);
  }
}

// Inicializa canvas de partículas brillantes para un fondo etéreo
function initializeSparkCanvas() {
  if (!sparkCanvas) {
    return;
  }

  canvasContext = sparkCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  sparkParticles = Array.from({ length: 36 }, () => createSparkParticle());
  animateSparkCanvas();
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = sparkCanvas.clientWidth;
  const height = sparkCanvas.clientHeight;
  sparkCanvas.width = width * ratio;
  sparkCanvas.height = height * ratio;
  canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createSparkParticle() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.2 + 0.8,
    alpha: Math.random() * 0.6 + 0.3,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.12,
    phase: Math.random() * Math.PI * 2,
  };
}

function animateSparkCanvas() {
  if (!canvasContext) {
    return;
  }

  const width = sparkCanvas.clientWidth;
  const height = sparkCanvas.clientHeight;
  canvasContext.clearRect(0, 0, width, height);

  sparkParticles.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.phase += 0.02;
    spark.alpha = 0.25 + Math.sin(spark.phase) * 0.18;

    if (spark.x < -20) spark.x = width + 20;
    if (spark.x > width + 20) spark.x = -20;
    if (spark.y < -20) spark.y = height + 20;
    if (spark.y > height + 20) spark.y = -20;

    const gradient = canvasContext.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, spark.radius * 18);
    gradient.addColorStop(0, `rgba(255, 248, 236, ${spark.alpha * 0.95})`);
    gradient.addColorStop(1, 'rgba(255, 248, 236, 0)');

    canvasContext.beginPath();
    canvasContext.fillStyle = gradient;
    canvasContext.arc(spark.x, spark.y, spark.radius * 18, 0, Math.PI * 2);
    canvasContext.fill();
  });

  animationFrameId = requestAnimationFrame(animateSparkCanvas);
}

// Detener animación si la página queda inactiva
window.addEventListener('unload', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
