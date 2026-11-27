// Navbar + scrollbar
const navbar = document.querySelector(".navbar");
const scrollProgress = document.querySelector("#scroll");

let lastPos = 0;

window.addEventListener("scroll", () => {
  const currentPos = window.scrollY;

  if (currentPos > lastPos && currentPos > 20) {
    navbar.classList.add("hidden");
  } else {
    navbar.classList.remove("hidden");
  }

  lastPos = currentPos;

  const maxScroll =
    document.body.scrollHeight - window.innerHeight;

  if (maxScroll > 0) {
    scrollProgress.style.width =
      (currentPos / maxScroll) * 100 + "%";
  }
});

// Past / Present toggle
const toggle = document.querySelector("#toggle");
const timeTitle = document.querySelector("#time_time");
const timeText = document.querySelector("#time_text");
const timeImage = document.querySelector("#time_img");
const timeImage2 = document.querySelector("#time_img_2");

toggle.addEventListener("change", () => {
  timeTitle.style.opacity = "0";
  timeText.style.opacity = "0";
  timeImage.style.opacity = "0";
  timeImage2.style.opacity = "0";

  setTimeout(() => {
    if (!toggle.checked) {
      timeTitle.textContent = "PAST — The 1980s";

      timeText.textContent =
        "In the past, consumption in China was nothing like it is now. Under Maoism, rationing coupons were used to allocate essential goods. Everything was relatively run-down, and state-run shops and wet markets were where you would go when you wanted to buy things.";

      timeImage.classList.remove("hide");
      timeImage2.classList.add("hide");
    } else {
      timeTitle.textContent = "PRESENT — The 2020s";

      timeText.textContent =
        "Today, people can shop in supermarkets, shopping malls and online. Mobile payments, online shopping platforms and home delivery have made buying goods much more convenient.";

      timeImage.classList.add("hide");
      timeImage2.classList.remove("hide");
    }

    timeTitle.style.opacity = "1";
    timeText.style.opacity = "1";
    timeImage.style.opacity = "1";
    timeImage2.style.opacity = "1";
  }, 400);
});

// Reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.2
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

// Intro fade-out
const intro = document.querySelector("#intro");

document.addEventListener("scroll", () => {
  const currentPos = window.scrollY;
  const maxHeight = window.innerHeight;

  const progress = Math.min(currentPos / maxHeight, 1);

  intro.style.opacity = 1 - progress;
});

// Card tilt
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      perspective(900px)
      rotateX(${(-y * 7).toFixed(2)}deg)
      rotateY(${(x * 9).toFixed(2)}deg)
      translateY(-4px)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// Moving green particles
(() => {
  const canvas = document.getElementById("particle-canvas");

  if (!canvas) {
    console.error("Particle canvas was not found.");
    return;
  }

  const ctx = canvas.getContext("2d");
  const box = canvas.parentElement;

  const particles = [];
  const PARTICLE_COUNT = 180;

  const MOUSE_RADIUS = 130;
  const PUSH_STRENGTH = 16;
  const CLICK_RADIUS = 200;
  const CLICK_STRENGTH = 30;

  let width = 0;
  let height = 0;
  let mouseX = -9999;
  let mouseY = -9999;
  let isOver = false;
  let clickTime = 0;
  let clickX = 0;
  let clickY = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = box.clientWidth;
    height = box.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();

    console.log(
      "Particles created:",
      particles.length,
      "Canvas size:",
      width,
      height
    );
  }

  function createParticles() {
    particles.length = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      particles.push({
        homeX: x,
        homeY: y,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: 1.5 + Math.random() * 1.5,
        wave: Math.random() * Math.PI * 2
      });
    }
  }

  function track(event) {
    const rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  }

  function animate(now) {
    ctx.clearRect(0, 0, width, height);

    const time = now * 0.001;

    for (const particle of particles) {
      let forceX = 0;
      let forceY = 0;

      if (isOver) {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < MOUSE_RADIUS && distance > 0.001) {
          const strength =
            (1 - distance / MOUSE_RADIUS) * PUSH_STRENGTH;

          forceX += (dx / distance) * strength;
          forceY += (dy / distance) * strength;
        }
      }

      const sinceClick = now - clickTime;

      if (sinceClick < 600) {
        const dx = particle.x - clickX;
        const dy = particle.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CLICK_RADIUS && distance > 0.001) {
          const strength =
            (1 - distance / CLICK_RADIUS) * CLICK_STRENGTH;

          forceX += (dx / distance) * strength;
          forceY += (dy / distance) * strength;
        }
      }

      const swayX =
        Math.sin(time * 1.2 + particle.wave) * 1.6;
      const swayY =
        Math.sin(time * 0.8 + particle.wave) * 1.6;

      particle.vx +=
        forceX +
        (particle.homeX + swayX - particle.x) * 0.06;

      particle.vy +=
        forceY +
        (particle.homeY + swayY - particle.y) * 0.06;

      particle.vx *= 0.86;
      particle.vy *= 0.86;

      particle.x += particle.vx;
      particle.y += particle.vy;

      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(60, 221, 140, 0.85)";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  box.addEventListener("pointermove", (event) => {
    isOver = true;
    track(event);
  });

  box.addEventListener("pointerleave", () => {
    isOver = false;
    mouseX = -9999;
    mouseY = -9999;
  });

  box.addEventListener("pointerdown", (event) => {
    track(event);

    clickTime = performance.now();
    clickX = mouseX;
    clickY = mouseY;
  });

  window.addEventListener("resize", resize);

  resize();
  requestAnimationFrame(animate);
})();