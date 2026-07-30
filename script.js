/* ==========================================================================
   1. PRELOADER LOGIC
   ========================================================================== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('fade-out');
  }, 1000);
});

/* ==========================================================================
   2. CANVAS ANIMATION (STARS, FLOATING HEARTS, SHOOTING STARS)
   ========================================================================== */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Glowing Background Star Class
class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.6;
    this.alpha = Math.random();
    this.speed = Math.random() * 0.015 + 0.005;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
  }
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.alpha)})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Floating Heart Class
class FloatingHeart {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = height + 30;
    this.size = Math.random() * 12 + 8;
    this.speedY = Math.random() * 1 + 0.6;
    this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
    this.opacity = Math.random() * 0.6 + 0.3;
    this.color = Math.random() > 0.5 ? '#ff2a85' : '#9d4edd';
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    if (this.y < -30) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const topCurveHeight = this.size * 0.3;
    ctx.moveTo(this.x, this.y + topCurveHeight);
    
    // Bezier heart curve math
    ctx.bezierCurveTo(
      this.x, this.y, 
      this.x - this.size / 2, this.y, 
      this.x - this.size / 2, this.y + topCurveHeight
    );
    ctx.bezierCurveTo(
      this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
      this.x, this.y + this.size, 
      this.x, this.y + this.size
    );
    ctx.bezierCurveTo(
      this.x, this.y + this.size, 
      this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
      this.x + this.size / 2, this.y + topCurveHeight
    );
    ctx.bezierCurveTo(
      this.x + this.size / 2, this.y, 
      this.x, this.y, 
      this.x, this.y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Shooting Star Class
class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * (height / 2);
    this.length = Math.random() * 80 + 50;
    this.speed = Math.random() * 8 + 4;
    this.opacity = 1;
    this.active = false;
  }
  spawn() {
    this.reset();
    this.active = true;
  }
  update() {
    if (!this.active) return;
    this.x -= this.speed;
    this.y += this.speed;
    this.opacity -= 0.015;
    if (this.opacity <= 0 || this.x < 0 || this.y > height) {
      this.active = false;
    }
  }
  draw() {
    if (!this.active) return;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.length, this.y - this.length);
    ctx.stroke();
    ctx.restore();
  }
}

// Particle Collections
const stars = Array.from({ length: 90 }, () => new Star());
const hearts = Array.from({ length: 30 }, () => new FloatingHeart());
const shootingStar = new ShootingStar();

// Periodically trigger a shooting star every few seconds
setInterval(() => {
  if (!shootingStar.active) {
    shootingStar.spawn();
  }
}, 4000);

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  stars.forEach(star => { star.update(); star.draw(); });
  hearts.forEach(heart => { heart.update(); heart.draw(); });
  shootingStar.update();
  shootingStar.draw();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ==========================================================================
   3. TYPEWRITER INTRO EFFECT
   ========================================================================== */
const titleText = "Hi Labibah ❤️";
const subtitleText = "This little world was made only for you.";

const titleElement = document.getElementById('typewriterTitle');
const subtitleElement = document.getElementById('typewriterSubtitle');

let titleIdx = 0;
let subtitleIdx = 0;

function typeTitle() {
  if (titleIdx < titleText.length) {
    titleElement.textContent += titleText.charAt(titleIdx);
    titleIdx++;
    setTimeout(typeTitle, 90);
  } else {
    setTimeout(typeSubtitle, 400);
  }
}

function typeSubtitle() {
  if (subtitleIdx < subtitleText.length) {
    subtitleElement.textContent += subtitleText.charAt(subtitleIdx);
    subtitleIdx++;
    setTimeout(typeSubtitle, 60);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeTitle, 1200);
});

/* ==========================================================================
   4. LIVE RELATIONSHIP COUNTER
   ========================================================================== */
// You can set your custom relationship start date here (YYYY-MM-DDTHH:MM:SS)
const startDate = new Date('2023-01-01T00:00:00');

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

/* ==========================================================================
   5. LOVE LETTER BUTTON TOGGLE
   ========================================================================== */
const openBtn = document.getElementById('openHeartBtn');
const loveLetter = document.getElementById('loveLetter');

openBtn.addEventListener('click', () => {
  loveLetter.classList.add('show');
  openBtn.style.display = 'none';
  loveLetter.scrollIntoView({ behavior: 'smooth' });
});

/* ==========================================================================
   6. BACKGROUND MUSIC & FIRST CLICK AUTOPLAY
   ========================================================================== */
const bgMusic = document.getElementById('bgMusic');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');
const audioText = document.getElementById('audioText');

let hasInteracted = false;

function playAudio() {
  bgMusic.play().then(() => {
    audioIcon.textContent = '🎶';
    audioText.textContent = 'Pause Music';
  }).catch(() => {
    // Autoplay prevented by browser settings
  });
}

function pauseAudio() {
  bgMusic.pause();
  audioIcon.textContent = '🎵';
  audioText.textContent = 'Play Music';
}

// Autoplay after user's first click anywhere on page
document.addEventListener('click', () => {
  if (!hasInteracted) {
    hasInteracted = true;
    playAudio();
  }
}, { once: true });

// Toggle audio on button click
audioToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents conflicting with body click
  hasInteracted = true;
  if (bgMusic.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});
