/**
 * HAPPY BIRTHDAY EXPERIENCE - JAVASCRIPT ENGINE
 * Handles: Audio Synthesizer, Fireworks, Starfield, Floating Balloons,
 * Touch Gestures, Cake Blowing, Gift Unboxing, and Customization.
 */

// ==================== STATE MANAGEMENT ====================
let currentSlide = 0;
const totalSlides = 5;
let isAudioPlaying = false;
let audioCtx = null;
let melodyTimeout = null;
let isMelodyLooping = false;
let candlesBlown = false;
let giftOpened = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initStarsAndBokeh();
  initFireworks();
  initConfetti();
  initCardTilt();
  initSparkleCursor();
  initNavigationEvents();
  initAudioToggle();
  initSlide5Fireworks();
  loadSavedPersonalization();
});

// ==================== WEB AUDIO API MUSIC BOX ====================
// Pure Web Audio API synthesizes a celestial music box version of "Happy Birthday"
// Zero external mp3 dependencies, works 100% offline and instant!
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Note frequencies (Hz)
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// "Happy Birthday to You" notes and durations (in beats)
const birthdayScore = [
  { note: NOTES.G4, dur: 0.75 },
  { note: NOTES.G4, dur: 0.25 },
  { note: NOTES.A4, dur: 1.0 },
  { note: NOTES.G4, dur: 1.0 },
  { note: NOTES.C5, dur: 1.0 },
  { note: NOTES.B4, dur: 2.0 },

  { note: NOTES.G4, dur: 0.75 },
  { note: NOTES.G4, dur: 0.25 },
  { note: NOTES.A4, dur: 1.0 },
  { note: NOTES.G4, dur: 1.0 },
  { note: NOTES.D5, dur: 1.0 },
  { note: NOTES.C5, dur: 2.0 },

  { note: NOTES.G4, dur: 0.75 },
  { note: NOTES.G4, dur: 0.25 },
  { note: NOTES.G5, dur: 1.0 },
  { note: NOTES.E5, dur: 1.0 },
  { note: NOTES.C5, dur: 1.0 },
  { note: NOTES.B4, dur: 1.0 },
  { note: NOTES.A4, dur: 1.5 },

  { note: NOTES.F5, dur: 0.75 },
  { note: NOTES.F5, dur: 0.25 },
  { note: NOTES.E5, dur: 1.0 },
  { note: NOTES.C5, dur: 1.0 },
  { note: NOTES.D5, dur: 1.0 },
  { note: NOTES.C5, dur: 2.5 }
];

function playCelestialTone(ctx, freq, startTime, duration) {
  // Primary chime oscillator
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, startTime);

  // Subtle overtone for bell/music box resonance
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, startTime);

  const overtoneGain = ctx.createGain();
  overtoneGain.gain.setValueAtTime(0.25, startTime);
  osc2.connect(overtoneGain);
  overtoneGain.connect(gainNode);

  osc1.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Attack & soft exponential decay
  gainNode.gain.setValueAtTime(0.001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.25, startTime + 0.04);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration);
  osc2.stop(startTime + duration);
}

function playBirthdayMelody() {
  if (!isAudioPlaying) return;
  const ctx = getAudioContext();
  const beatLength = 0.55; // tempo
  let now = ctx.currentTime + 0.1;

  for (let i = 0; i < birthdayScore.length; i++) {
    const item = birthdayScore[i];
    const duration = item.dur * beatLength;
    playCelestialTone(ctx, item.note, now, duration * 1.5);
    now += duration;
  }

  // Calculate total loop duration and repeat if still active
  const totalDurationMs = (now - ctx.currentTime + 1.5) * 1000;
  melodyTimeout = setTimeout(() => {
    if (isAudioPlaying) {
      playBirthdayMelody();
    }
  }, totalDurationMs);
}

function stopBirthdayMelody() {
  if (melodyTimeout) {
    clearTimeout(melodyTimeout);
    melodyTimeout = null;
  }
}

function toggleAudio() {
  const pill = document.getElementById('musicToggleBtn');
  const ctx = getAudioContext();

  if (isAudioPlaying) {
    isAudioPlaying = false;
    pill.classList.remove('playing');
    stopBirthdayMelody();
  } else {
    isAudioPlaying = true;
    pill.classList.add('playing');
    playBirthdayMelody();
  }
}

function initAudioToggle() {
  const pill = document.getElementById('musicToggleBtn');
  pill.addEventListener('click', toggleAudio);

  // Auto-unlock audio context on first user click anywhere
  const unlockAudio = () => {
    getAudioContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}

// Sound effects: Pop, Blow, Fireworks
function playPopSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

function playBlowSound() {
  const ctx = getAudioContext();
  // White noise burst for air whoosh
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.2;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
}

function playCelebrationChime() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const chord = [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6];
  chord.forEach((freq, idx) => {
    playCelestialTone(ctx, freq, now + (idx * 0.08), 1.2);
  });
}

// ==================== CELESTIAL STARDUST & BOKEH ENGINE ====================
let cursorSparks = [];

function initStarsAndBokeh() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let bokehOrbs = [];
  let shootingStars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
    createBokeh();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((width * height) / 3600);
    const starColors = [
      '255, 255, 255',
      '254, 240, 138', // warm yellow
      '245, 158, 11',  // amber gold
      '232, 121, 249', // soft violet
      '196, 181, 253'  // lavender
    ];

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        speed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function createBokeh() {
    bokehOrbs = [];
    const count = Math.min(18, Math.floor(width / 60));
    const bokehColors = [
      'rgba(245, 158, 11, ', // golden amber
      'rgba(236, 72, 153, ', // rose magenta
      'rgba(168, 85, 247, ', // purple
      'rgba(254, 240, 138, ' // champagne gold
    ];

    for (let i = 0; i < count; i++) {
      bokehOrbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 35 + 20,
        colorPrefix: bokehColors[Math.floor(Math.random() * bokehColors.length)],
        alpha: Math.random() * 0.22 + 0.08,
        vy: -(Math.random() * 0.35 + 0.15),
        vx: (Math.random() - 0.5) * 0.2,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        pulseVal: Math.random() * Math.PI
      });
    }
  }

  function addShootingStar() {
    if (Math.random() < 0.012 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * width * 0.85,
        y: Math.random() * height * 0.35,
        length: Math.random() * 90 + 60,
        speed: Math.random() * 6 + 7,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw glowing bokeh light orbs
    for (let b of bokehOrbs) {
      b.y += b.vy;
      b.x += b.vx;
      b.pulseVal += b.pulseSpeed;
      const currentAlpha = b.alpha * (0.8 + 0.3 * Math.sin(b.pulseVal));

      if (b.y < -b.radius * 2) {
        b.y = height + b.radius;
        b.x = Math.random() * width;
      }

      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      grad.addColorStop(0, `${b.colorPrefix}${currentAlpha})`);
      grad.addColorStop(0.6, `${b.colorPrefix}${currentAlpha * 0.4})`);
      grad.addColorStop(1, `${b.colorPrefix}0)`);

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 2. Draw static twinkling stars
    for (let s of stars) {
      s.alpha += s.speed * s.twinkleDir;
      if (s.alpha > 0.95) {
        s.alpha = 0.95;
        s.twinkleDir = -1;
      } else if (s.alpha < 0.15) {
        s.alpha = 0.15;
        s.twinkleDir = 1;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
      if (s.radius > 1.2) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${s.color}, 0.8)`;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 3. Draw shooting stars
    addShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      let ss = shootingStars[i];
      const endX = ss.x - Math.cos(ss.angle) * ss.length;
      const endY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
      grad.addColorStop(0, `rgba(254, 240, 138, ${ss.alpha})`);
      grad.addColorStop(0.3, `rgba(236, 72, 153, ${ss.alpha * 0.6})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.015;

      if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
        shootingStars.splice(i, 1);
      }
    }

    // 4. Draw cursor/touch interactive stardust trail
    for (let i = cursorSparks.length - 1; i >= 0; i--) {
      let sp = cursorSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= sp.decay;
      sp.size *= 0.96;

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, Math.max(0.2, sp.size), 0, Math.PI * 2);
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = Math.max(0, sp.alpha);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (sp.alpha <= 0 || sp.size <= 0.2) {
        cursorSparks.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  render();
}

function initSparkleCursor() {
  const sparkColors = ['#fef08a', '#fbbf24', '#f472b6', '#c084fc', '#ffffff'];

  function addSparkles(x, y) {
    if (cursorSparks.length > 40) return;
    for (let i = 0; i < 2; i++) {
      cursorSparks.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 1.5 + 0.5,
        size: Math.random() * 2.5 + 1.2,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        alpha: 0.9,
        decay: Math.random() * 0.025 + 0.02
      });
    }
  }

  window.addEventListener('pointermove', (e) => {
    addSparkles(e.clientX, e.clientY);
  }, { passive: true });
}

// ==================== 3D CARD TILT & SPECULAR REFLECTION ====================
function initCardTilt() {
  const frame = document.getElementById('photoFrame');
  const reflection = document.getElementById('cardReflection');
  if (!frame) return;

  function handleMove(clientX, clientY) {
    const rect = frame.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (clientX - centerX) / (rect.width / 2);
    const deltaY = (clientY - centerY) / (rect.height / 2);

    const rotateY = Math.max(-10, Math.min(10, deltaX * 10));
    const rotateX = Math.max(-10, Math.min(10, -deltaY * 10));

    frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (reflection) {
      const reflX = (deltaX * 50) + 50;
      const reflY = (deltaY * 50) + 50;
      reflection.style.background = `radial-gradient(circle at ${reflX}% ${reflY}%, rgba(255, 255, 255, 0.28) 0%, transparent 60%)`;
      reflection.style.opacity = '1';
    }
  }

  function handleReset() {
    frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (reflection) reflection.style.opacity = '0';
  }

  window.addEventListener('mousemove', (e) => {
    if (currentSlide === 0) {
      handleMove(e.clientX, e.clientY);
    }
  }, { passive: true });

  frame.addEventListener('mouseleave', handleReset);

  frame.addEventListener('touchmove', (e) => {
    if (currentSlide === 0 && e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  frame.addEventListener('touchend', handleReset);
}

// ==================== SLIDE PRESENTATION ENGINE ====================
function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  const slides = document.querySelectorAll('.story-slide');
  const dots = document.querySelectorAll('.indicator-dot');

  slides.forEach((s, idx) => {
    s.classList.remove('active', 'previous');
    if (idx < index) {
      s.classList.add('previous');
    }
  });

  dots.forEach(d => d.classList.remove('active'));

  currentSlide = index;
  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');

  // Trigger special scene actions
  if (currentSlide === 4) {
    // Finale: launch celebratory fireworks & confetti
    setTimeout(triggerFireworksBlast, 300);
    setTimeout(triggerConfettiBurst, 700);
  }
}

function initSlide5Fireworks() {
  const slide5 = document.getElementById('slide-5');
  if (slide5) {
    slide5.addEventListener('click', (e) => {
      // Don't trigger if clicked on a button
      if (e.target.closest('button')) return;
      createFirework(e.clientX, e.clientY);
    });
  }
}

function nextSlide() {
  // If audio is not playing on first user advance, offer seamless auto-start
  if (!isAudioPlaying && audioCtx && audioCtx.state !== 'closed') {
    toggleAudio();
  }

  if (currentSlide < totalSlides - 1) {
    goToSlide(currentSlide + 1);
  } else {
    goToSlide(0);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
}

function initNavigationEvents() {
  // Wheel scroll with debounce
  let isScrolling = false;
  window.addEventListener('wheel', (e) => {
    // Avoid triggering when inside modal
    if (document.getElementById('customModal').classList.contains('show')) return;
    // Don't hijack scroll if user is scrolling inside cards or letters
    if (e.target.closest('.cards-grid') || e.target.closest('.parchment-letter') || e.target.closest('.modal-body')) return;
    if (isScrolling) return;

    if (e.deltaY > 65) {
      isScrolling = true;
      nextSlide();
      setTimeout(() => { isScrolling = false; }, 900);
    } else if (e.deltaY < -65) {
      isScrolling = true;
      prevSlide();
      setTimeout(() => { isScrolling = false; }, 900);
    }
  }, { passive: true });

  // Touch swipe support (mobile friendly - supports both vertical & horizontal gestures)
  let touchStartY = 0;
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (document.getElementById('customModal').classList.contains('show')) return;
    // Don't swipe slide if user interacted with a card, button, cake, gift, or form element
    if (e.target.closest('.reveal-card') || 
        e.target.closest('button') || 
        e.target.closest('.cake-stage') || 
        e.target.closest('.gift-box-wrapper') ||
        e.target.closest('input') ||
        e.target.closest('textarea')) return;
        
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    // Vertical swipe (up/down)
    if (Math.abs(diffY) > 55 && Math.abs(diffY) > Math.abs(diffX) * 1.2) {
      if (diffY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } 
    // Horizontal swipe (left/right)
    else if (Math.abs(diffX) > 55 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (document.getElementById('customModal').classList.contains('show')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  });
}

// ==================== SCENE 2: INTERACTIVE REVEAL CARDS ====================
function toggleRevealCard(cardEl) {
  const isRevealed = cardEl.classList.toggle('revealed');
  const hintText = cardEl.querySelector('.hint-text');

  if (isRevealed) {
    if (hintText) hintText.innerText = '✨ Revealed';
    playCelestialTone(getAudioContext(), NOTES.E5, getAudioContext().currentTime, 0.4);

    // Sparkle burst around the card
    const rect = cardEl.getBoundingClientRect();
    burstConfettiAt(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ec4899');
  } else {
    if (hintText) hintText.innerText = 'Tap to reveal';
  }
}

// Alias for backward compatibility
function flipCard(cardEl) {
  toggleRevealCard(cardEl);
}

// ==================== SCENE 3: CAKE BLOWING ====================
function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;

  playBlowSound();

  // Extinguish flames
  const flames = [document.getElementById('flame1'), document.getElementById('flame2'), document.getElementById('flame3')];
  const smokes = [document.getElementById('smoke1'), document.getElementById('smoke2'), document.getElementById('smoke3')];

  flames.forEach(f => f.classList.add('extinguished'));
  smokes.forEach(s => s.classList.add('active'));

  // Reveal wish granted banner
  const wishBanner = document.getElementById('wishReveal');
  const blowBtn = document.getElementById('blowBtn');
  blowBtn.innerHTML = '<span>✨ Wish Granted!</span>';
  blowBtn.style.opacity = '0.7';
  blowBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    wishBanner.classList.add('show');
    playCelebrationChime();
    triggerConfettiBurst();
  }, 400);
}

// ==================== SCENE 4: GIFT UNBOXING ====================
function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  playCelebrationChime();

  const giftBox = document.getElementById('giftBox');
  giftBox.querySelector('.gift-box').classList.add('opened');
  document.getElementById('giftHint').style.display = 'none';

  // Confetti explosion around gift box
  const rect = giftBox.getBoundingClientRect();
  burstConfettiAt(rect.left + rect.width / 2, rect.top, '#f59e0b');

  // Reveal parchment letter
  setTimeout(() => {
    document.getElementById('letterContainer').classList.add('show');
  }, 500);
}

// ==================== CONFETTI ENGINE ====================
let confettiCanvas, confettiCtx;
let confettiParticles = [];

function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx = confettiCanvas.getContext('2d');

  function resize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  renderConfetti();
}

function triggerConfettiBurst() {
  const colors = ['#ec4899', '#a855f7', '#f59e0b', '#38bdf8', '#f43f5e', '#ffffff'];
  for (let i = 0; i < 90; i++) {
    confettiParticles.push({
      x: window.innerWidth * (0.3 + Math.random() * 0.4),
      y: window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -12 - 5,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }
}

function burstConfettiAt(x, y, tintColor) {
  const colors = [tintColor, '#ffffff', '#fef08a'];
  for (let i = 0; i < 35; i++) {
    confettiParticles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14 - 3,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      opacity: 1
    });
  }
}

function renderConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    let p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35; // gravity
    p.vx *= 0.98; // air drag
    p.rotation += p.rotSpeed;
    p.opacity -= 0.008;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.globalAlpha = Math.max(0, p.opacity);
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
    confettiCtx.restore();

    if (p.opacity <= 0 || p.y > confettiCanvas.height) {
      confettiParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(renderConfetti);
}

// ==================== FIREWORKS ENGINE ====================
let fwCanvas, fwCtx;
let fireworks = [];

function initFireworks() {
  fwCanvas = document.getElementById('fireworks-canvas');
  fwCtx = fwCanvas.getContext('2d');

  function resize() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Tap anywhere on canvas to launch fireworks
  fwCanvas.addEventListener('pointerdown', (e) => {
    // Only launch fireworks on finale slide or let user launch anywhere
    createFirework(e.clientX, e.clientY);
  });

  renderFireworks();
}

function createFirework(targetX, targetY) {
  const colors = [
    '#ec4899', '#a855f7', '#fbbf24', '#38bdf8', '#4ade80', '#f43f5e', '#ffffff'
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const particleCount = 65;

  playPopSound();

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 / particleCount) * i + (Math.random() * 0.1);
    const speed = Math.random() * 5 + 2;
    fireworks.push({
      x: targetX,
      y: targetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: color,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.012,
      size: Math.random() * 2.5 + 1.5
    });
  }
}

function triggerFireworksBlast() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  createFirework(w * 0.3, h * 0.35);
  setTimeout(() => createFirework(w * 0.7, h * 0.3), 250);
  setTimeout(() => createFirework(w * 0.5, h * 0.25), 500);
}

function renderFireworks() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    let p = fireworks[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08; // gravity
    p.alpha -= p.decay;

    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fillStyle = p.color;
    fwCtx.globalAlpha = Math.max(0, p.alpha);
    fwCtx.shadowBlur = 8;
    fwCtx.shadowColor = p.color;
    fwCtx.fill();

    if (p.alpha <= 0) {
      fireworks.splice(i, 1);
    }
  }

  requestAnimationFrame(renderFireworks);
}

// ==================== BACKGROUND PHOTO CONTROLS ====================
function adjustBgBrightness(val) {
  const bgImg = document.getElementById('bgPhotoImg');
  const label = document.getElementById('bgOpacityVal');
  if (bgImg) {
    bgImg.style.opacity = (val / 100);
  }
  if (label) {
    label.innerText = `${val}%`;
  }
  localStorage.setItem('hbd_bg_opacity', val);
}

function toggleBackgroundMode() {
  const isFull = document.body.classList.toggle('fullscreen-bg-mode');
  const modeBtn = document.getElementById('bgStyleToggleBtn');
  const modeText = document.getElementById('bgModeText');
  if (modeText) {
    modeText.innerText = isFull ? 'Fullscreen' : 'Card View';
  }
  if (modeBtn) {
    modeBtn.classList.toggle('active', isFull);
    modeBtn.title = isFull ? 'Switch to Card View' : 'Switch to Fullscreen Background';
  }
  localStorage.setItem('hbd_bg_mode', isFull ? 'fullscreen' : 'card');
}

function setPhotoPreset(preset) {
  const bgImg = document.getElementById('bgPhotoImg');
  const userPhoto = document.getElementById('userPhoto');
  if (preset === 'cosmic_bg') {
    if (bgImg) bgImg.style.backgroundImage = "url('assets/heart_pose_bg.png')";
    if (userPhoto) userPhoto.src = 'assets/portrait_person.png';
    localStorage.setItem('hbd_bg_photo', 'assets/heart_pose_bg.png');
    localStorage.setItem('hbd_user_photo', 'assets/portrait_person.png');
  } else if (preset === 'heart_both') {
    if (bgImg) bgImg.style.backgroundImage = "url('assets/heart_pose_bg.png')";
    if (userPhoto) userPhoto.src = 'assets/heart_pose_cutout.png';
    localStorage.setItem('hbd_bg_photo', 'assets/heart_pose_bg.png');
    localStorage.setItem('hbd_user_photo', 'assets/heart_pose_cutout.png');
  } else if (preset === 'striped_card') {
    if (userPhoto) userPhoto.src = 'assets/portrait_person.png';
    localStorage.setItem('hbd_user_photo', 'assets/portrait_person.png');
  }
  triggerSparkleAtCenter();
}

// ==================== PERSONALIZATION MODAL ====================
const customizeBtn = document.getElementById('customizeBtn');
const customModal = document.getElementById('customModal');

customizeBtn.addEventListener('click', () => {
  customModal.classList.add('show');
});

function closeModal() {
  customModal.classList.remove('show');
}

customModal.addEventListener('click', (e) => {
  if (e.target === customModal) closeModal();
});

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    document.getElementById('userPhoto').src = dataUrl;
    const bgImg = document.getElementById('bgPhotoImg');
    if (bgImg) {
      bgImg.style.backgroundImage = `url('${dataUrl}')`;
    }
    localStorage.setItem('hbd_user_photo', dataUrl);
  };
  reader.readAsDataURL(file);
}

function savePersonalization() {
  const name = document.getElementById('inputName').value.trim();
  const quote = document.getElementById('inputQuote').value.trim();
  const letter = document.getElementById('inputLetter').value.trim();
  const signature = document.getElementById('inputSignature').value.trim();

  if (name) {
    document.getElementById('finaleName').innerText = `To ${name} ✨`;
    localStorage.setItem('hbd_name', name);
  }

  if (quote) {
    document.getElementById('quoteText').innerHTML = quote.replace(/\n/g, '<br>');
    localStorage.setItem('hbd_quote', quote);
  }

  if (letter) {
    const paragraphs = letter.split('\n\n').filter(p => p.trim());
    document.getElementById('letterBody').innerHTML = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    localStorage.setItem('hbd_letter', letter);
  }

  if (signature) {
    document.getElementById('signatureName').innerText = signature;
    localStorage.setItem('hbd_signature', signature);
  }

  closeModal();
  triggerConfettiBurst();
}

function loadSavedPersonalization() {
  const savedName = localStorage.getItem('hbd_name');
  if (savedName) {
    document.getElementById('finaleName').innerText = `To ${savedName} ✨`;
    document.getElementById('inputName').value = savedName;
  }

  const savedQuote = localStorage.getItem('hbd_quote');
  if (savedQuote) {
    document.getElementById('quoteText').innerHTML = savedQuote.replace(/\n/g, '<br>');
    document.getElementById('inputQuote').value = savedQuote;
  }

  const savedBg = localStorage.getItem('hbd_bg_photo');
  const bgImg = document.getElementById('bgPhotoImg');
  if (bgImg) {
    if (savedBg && (savedBg.startsWith('data:image') || savedBg.startsWith('assets/'))) {
      bgImg.style.backgroundImage = `url('${savedBg}')`;
    } else {
      bgImg.style.backgroundImage = "url('assets/heart_pose_bg.png')";
    }
  }

  const savedPhoto = localStorage.getItem('hbd_user_photo');
  const userPhoto = document.getElementById('userPhoto');
  if (userPhoto) {
    if (savedPhoto && (savedPhoto.startsWith('data:image') || savedPhoto.startsWith('assets/'))) {
      userPhoto.src = savedPhoto;
    } else {
      userPhoto.src = 'assets/portrait_person.png';
    }
  }

  const savedLetter = localStorage.getItem('hbd_letter');
  if (savedLetter) {
    const paragraphs = savedLetter.split('\n\n').filter(p => p.trim());
    document.getElementById('letterBody').innerHTML = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    document.getElementById('inputLetter').value = savedLetter;
  }

  const savedSignature = localStorage.getItem('hbd_signature');
  if (savedSignature) {
    document.getElementById('signatureName').innerText = savedSignature;
    document.getElementById('inputSignature').value = savedSignature;
  }

  // Load background settings
  const savedOpacity = localStorage.getItem('hbd_bg_opacity');
  if (savedOpacity) {
    const slider = document.getElementById('bgOpacitySlider');
    if (slider) slider.value = savedOpacity;
    adjustBgBrightness(savedOpacity);
  } else {
    adjustBgBrightness(70);
  }

  const savedMode = localStorage.getItem('hbd_bg_mode');
  if (savedMode === 'fullscreen') {
    document.body.classList.add('fullscreen-bg-mode');
    const modeBtn = document.getElementById('bgStyleToggleBtn');
    const modeText = document.getElementById('bgModeText');
    if (modeText) modeText.innerText = 'Fullscreen';
    if (modeBtn) {
      modeBtn.classList.add('active');
      modeBtn.title = 'Switch to Card View';
    }
  }
}

function resetToDefaults() {
  localStorage.removeItem('hbd_name');
  localStorage.removeItem('hbd_quote');
  localStorage.removeItem('hbd_user_photo');
  localStorage.removeItem('hbd_bg_photo');
  localStorage.removeItem('hbd_letter');
  localStorage.removeItem('hbd_signature');
  localStorage.removeItem('hbd_bg_opacity');
  localStorage.removeItem('hbd_bg_mode');

  document.body.classList.remove('fullscreen-bg-mode');
  const modeBtn = document.getElementById('bgStyleToggleBtn');
  const modeText = document.getElementById('bgModeText');
  if (modeText) modeText.innerText = 'Card View';
  if (modeBtn) {
    modeBtn.classList.remove('active');
    modeBtn.title = 'Switch to Fullscreen Background';
  }

  const defaultPortrait = 'assets/portrait_person.png';
  const defaultBg = 'assets/heart_pose_bg.png';
  const userPhoto = document.getElementById('userPhoto');
  if (userPhoto) userPhoto.src = defaultPortrait;
  const bgImg = document.getElementById('bgPhotoImg');
  if (bgImg) {
    bgImg.style.backgroundImage = `url('${defaultBg}')`;
    bgImg.style.opacity = '0.70';
  }

  const slider = document.getElementById('bgOpacitySlider');
  if (slider) slider.value = '70';
  const label = document.getElementById('bgOpacityVal');
  if (label) label.innerText = '70%';

  document.getElementById('finaleName').innerText = 'To Someone Truly Special ✨';
  document.getElementById('quoteText').innerHTML = `"Tonight isn't ordinary.<br>The stars are glowing softer,<br>the moon feels warmer,<br>and the universe is quietly celebrating<br>someone truly special. ✨"`;
  document.getElementById('signatureName').innerText = 'Always Cheering for You ✨';

  closeModal();
}
