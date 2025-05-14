import confetti from "canvas-confetti";

export function launchBasicConfetti(customOptions = {}) {
  const defaultOptions = {
    particleCount: 150,
    spread: 180,
    origin: { y: 0.6 },
    angle: 90,
    startVelocity: 40,
    gravity: 0.8,
    ticks: 300,
    colors: [
      "#FFC0CB", // LightPink
      "#FF69B4", // HotPink
      "#FF1493", // DeepPink
      "#C71585", // MediumVioletRed
      "#DB7093", // PaleVioletRed
      "#FFFFFF", // White
    ],
  };

  confetti({ ...defaultOptions, ...customOptions });
}

export function launchRealisticConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function launchCombinedConfetti() {
  launchBasicConfetti();
  launchRealisticConfetti();
}
