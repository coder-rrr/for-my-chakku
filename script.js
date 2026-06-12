const memories = [
  {
    photo: "photos/photo1.jpeg",
    song: "music/song1.mp3",
    caption: "You feeding me your lunch will always hold a special place in my heart"
  },
  {
    photo: "photos/photo2.jpeg",
    song: "music/song2.mp3",
    caption: "We survived the toxic friend groups and people together."
  },
  {
    photo: "photos/photo3.jpeg",
    song: "music/song3.mp3",
    caption: "We had always synced when it comes to love lifes, break ups, sucess, losses all of it somehow ended up in sync"
  },
  {
    photo: "photos/photo4.jpeg",
    song: "music/song4.mp3",
    caption: "You will forever be the sensible person who stops me from doing stupid things and someone who doesn't leave my side when things go wrong"
  },
  {
    photo: "photos/photo5.jpeg",
    song: "music/song5.mp3",
    caption: "The empty classroom chapter, where we cut class, watched videos, and told each other everything."
  },
  {
    photo: "photos/photo6.jpeg",
    song: "music/song6.mp3",
    caption: "Our friendship, somehow, kept leveling up."
  },
  {
    photo: "photos/photo7.jpeg",
    song: "music/song7.mp3",
    caption: "You are best buddy and my no.1 takeaway from Uni"
  }
];

const finalLines = [
  "Out of all the things university gave me...",
  "You were one of the best.",
  "Thank you for tolarating my nonsense.",
  "Every conversation.",
  "Every laugh.",
  "Every meal.",
  "And every version of me that you stayed through.",
  "The UK is just another chapter.",
  "This isn't goodbye.",
  "It's just a very long group project in different countries.",
  "New Friends, New people but don't forget me",
  "I hope to see you again soon. I have told your dad to get you here sometimes so we can have a drink and catch up.",
  "I LOVE YOU SO MUCH"
];

const albumCards = [
  { photo: "photos/photo1.jpeg", caption: "You feeding me your lunch", song: "music/song1.mp3", rot: "-6deg" },
  { photo: "photos/photo2.jpeg", caption: "We survived the toxic friend groups and people together.", song: "music/song2.mp3", rot: "4deg" },
  { photo: "photos/photo3.jpeg", caption: "Friendship so goated life started syncing.", song: "music/song3.mp3", rot: "-3deg" },
  { photo: "photos/photo4.jpeg", caption: "The person who never left my side when I was being too much.", song: "music/song4.mp3", rot: "7deg" },
  { photo: "photos/photo5.jpeg", caption: "Our quiet escape: empty classroom, one video, endless stories.", song: "music/song5.mp3", rot: "-8deg" },
  { photo: "photos/photo6.jpeg", caption: "Small moments. Big friendship.", song: "music/song6.mp3", rot: "5deg" },
  { photo: "photos/photo7.jpeg", caption: "The distance changes, not us.", song: "music/song7.mp3", rot: "-1deg" },
  { photo: "photos/photo8.jpeg", caption: "There is always room for another memory.", song: "music/song1.mp3", rot: "9deg" }
];

const audioPlayer = document.getElementById("audioPlayer");
const trackTitle = document.getElementById("trackTitle");
const trackStatus = document.getElementById("trackStatus");
const playPause = document.getElementById("playPause");
const nextTrack = document.getElementById("nextTrack");
const prevTrack = document.getElementById("prevTrack");
const volumeSlider = document.getElementById("volumeSlider");
const startJourney = document.getElementById("startJourney");
const toast = document.getElementById("toast");
const albumGrid = document.getElementById("albumGrid");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const secretOverlay = document.getElementById("secretOverlay");
const finalText = document.getElementById("finalText");
const finalPhoto = document.querySelector(".finale__photo");

let currentTrack = 0;
let unlocked = false;
let journeyStarted = false;
let secretBuffer = "";
let toastTimer;

window.addEventListener("error", (event) => {
  const target = event.target;
  if (target && ["IMG", "AUDIO", "SOURCE"].includes(target.tagName)) {
    event.preventDefault();
  }
}, true);

const fallbackArt = (title, caption) => {
  const safeTitle = escapeHtml(title || "Memory");
  const safeCaption = escapeHtml(caption || "A moment worth keeping.");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8efe4" />
          <stop offset="50%" stop-color="#e6c9d2" />
          <stop offset="100%" stop-color="#c5b7e1" />
        </linearGradient>
        <radialGradient id="r" cx="50%" cy="25%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" rx="36" fill="url(#g)"/>
      <circle cx="250" cy="170" r="140" fill="url(#r)"/>
      <circle cx="560" cy="220" r="120" fill="rgba(255,255,255,0.3)"/>
      <rect x="95" y="110" width="610" height="340" rx="28" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.45)" stroke-width="3"/>
      <text x="400" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="#3f3127">${safeTitle}</text>
      <text x="400" y="350" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#6f5b4c">${safeCaption}</text>
    </svg>
  `)}`;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
};

const updateTrackMeta = () => {
  const track = memories[currentTrack];
  trackTitle.textContent = `Memory ${currentTrack + 1}`;
  trackStatus.textContent = track ? track.caption : "Ready";
};

const setTrack = (index, autoplay = false) => {
  const nextIndex = (index + memories.length) % memories.length;
  currentTrack = nextIndex;
  const track = memories[nextIndex];
  audioPlayer.src = track.song;
  audioPlayer.volume = Number(volumeSlider.value);
  updateTrackMeta();
  if (autoplay) {
    audioPlayer.play().then(() => {
      playPause.textContent = "Pause";
      trackStatus.textContent = "Playing the current memory";
    }).catch(() => {
      playPause.textContent = "Play";
      trackStatus.textContent = "Tap play if the browser is waiting for permission";
    });
  }
};

const togglePlay = () => {
  if (!audioPlayer.src) {
    setTrack(currentTrack, false);
  }
  if (audioPlayer.paused) {
    audioPlayer.play().then(() => {
      playPause.textContent = "Pause";
      trackStatus.textContent = "Playing the current memory";
    }).catch(() => {
      showToast("Audio is waiting for your browser's permission.");
    });
  } else {
    audioPlayer.pause();
    playPause.textContent = "Play";
    trackStatus.textContent = "Paused";
  }
};

const renderAlbum = () => {
  albumGrid.innerHTML = albumCards.map((card, index) => {
    const imgSrc = card.photo;
    return `
      <button class="album-card" type="button" style="--rot:${card.rot}" data-index="${index}">
        <div class="album-card__inner">
          <img src="${imgSrc}" alt="${escapeHtml(card.caption)}" onerror="this.onerror=null;this.src='${fallbackArt(`Album ${index + 1}`, card.caption)}';" />
          <p>${escapeHtml(card.caption)}</p>
        </div>
      </button>
    `;
  }).join("");
};

const openLightbox = (index) => {
  const item = albumCards[index];
  lightboxImage.src = item.photo;
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = item.caption;
  lightboxImage.onerror = () => {
    lightboxImage.onerror = null;
    lightboxImage.src = fallbackArt(`Album ${index + 1}`, item.caption);
  };
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  setTrack(index % memories.length, true);
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
};

const openPopup = (title, text) => {
  popupTitle.textContent = title;
  popupText.textContent = text;
  popup.classList.add("is-open");
  popup.setAttribute("aria-hidden", "false");
};

const closePopup = () => {
  popup.classList.remove("is-open");
  popup.setAttribute("aria-hidden", "true");
};

const openSecret = () => {
  secretOverlay.classList.add("is-open");
  secretOverlay.setAttribute("aria-hidden", "false");
};

const closeSecret = () => {
  secretOverlay.classList.remove("is-open");
  secretOverlay.setAttribute("aria-hidden", "true");
};

const markVisible = (entry) => {
  entry.target.classList.add("is-visible");
  if (entry.target.matches("[data-memory]")) {
    const index = Number(entry.target.dataset.memory);
    const frame = entry.target.querySelector(".photo-shell");
    const photo = entry.target.querySelector("[data-photo]");
    const caption = entry.target.querySelector("[data-caption]");
    const memory = memories[index];

    photo.src = memory.photo;
    photo.alt = memory.caption;
    photo.onerror = () => {
      photo.onerror = null;
      photo.src = fallbackArt(`Memory ${index + 1}`, memory.caption);
    };
    caption.textContent = memory.caption;
    frame.classList.add("is-active");
    setTrack(index, journeyStarted);
  }
  if (entry.target.id === "finale") {
    startFinalSequence();
    setTrack(memories.length - 1, true);
  }
  if (entry.target.querySelector("[data-counter]")) {
    animateCounters(entry.target);
  }
};

const animateCounters = (section) => {
  section.querySelectorAll("[data-counter]").forEach((node) => {
    const target = Number(node.dataset.counter);
    let current = 0;
    const duration = 1200 + target * 6;
    const started = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      current = Math.round(target * easeOutCubic(progress));
      node.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const startFinalSequence = () => {
  if (unlocked) {
    return;
  }
  unlocked = true;
  finalText.innerHTML = "";
  finalLines.forEach((line, index) => {
    const span = document.createElement("span");
    span.className = "finale__line";
    span.textContent = line;
    finalText.appendChild(span);
    window.setTimeout(() => span.classList.add("is-visible"), 550 * index);
  });

  finalPhoto.src = memories[memories.length - 1].photo;
  finalPhoto.onerror = () => {
    finalPhoto.onerror = null;
    finalPhoto.src = fallbackArt("Final memory", "See you in the next adventure.");
  };
};

const unlockJourney = () => {
  if (journeyStarted) {
    return;
  }
  journeyStarted = true;
  document.getElementById("journey").scrollIntoView({ behavior: "smooth", block: "start" });
  setTrack(0, true);
  showToast("The journey has begun.");
};

const setupObservers = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        markVisible(entry);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll("[data-reveal], [data-memory], #finale").forEach((el) => observer.observe(el));
};

const setupBackgroundMotion = () => {
  const starfield = document.getElementById("starfield");
  const sparkles = document.getElementById("sparkles");
  const starCount = 90;
  const sparkleCount = 18;

  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${5 + Math.random() * 10}s, ${3 + Math.random() * 3}s`;
    star.style.animationDelay = `${Math.random() * 6}s`;
    starfield.appendChild(star);
  }

  for (let i = 0; i < sparkleCount; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.bottom = `${Math.random() * 100}%`;
    sparkle.style.animationDuration = `${10 + Math.random() * 8}s`;
    sparkle.style.animationDelay = `${Math.random() * 5}s`;
    sparkle.style.opacity = String(0.15 + Math.random() * 0.45);
    sparkles.appendChild(sparkle);
  }
};

const setupInteractions = () => {
  startJourney.addEventListener("click", unlockJourney);
  playPause.addEventListener("click", togglePlay);
  nextTrack.addEventListener("click", () => {
    setTrack(currentTrack + 1, true);
  });
  prevTrack.addEventListener("click", () => {
    setTrack(currentTrack - 1, true);
  });
  volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = Number(volumeSlider.value);
  });

  document.addEventListener("click", (event) => {
    const closeTarget = event.target.closest("[data-close-popup], [data-close-lightbox], [data-close-secret]");
    if (closeTarget) {
      closePopup();
      closeLightbox();
      closeSecret();
      return;
    }

    const roomItem = event.target.closest(".room__item");
    if (roomItem) {
      openPopup(roomItem.dataset.popupTitle, roomItem.dataset.popupText);
      return;
    }

    const albumCard = event.target.closest(".album-card");
    if (albumCard) {
      openLightbox(Number(albumCard.dataset.index));
      return;
    }

  });

  audioPlayer.addEventListener("play", () => {
    playPause.textContent = "Pause";
  });

  audioPlayer.addEventListener("pause", () => {
    playPause.textContent = "Play";
  });

  audioPlayer.addEventListener("error", () => {
    trackStatus.textContent = "This song can be replaced later without changing the page.";
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-lightbox]")) {
      closeLightbox();
    }
  });

  popup.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-popup]")) {
      closePopup();
    }
  });

  secretOverlay.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-secret]")) {
      closeSecret();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePopup();
      closeLightbox();
      closeSecret();
      return;
    }

    if (event.key.length === 1) {
      secretBuffer = `${secretBuffer}${event.key.toLowerCase()}`.slice(-9);
      if (secretBuffer === "legendary") {
        openSecret();
        secretBuffer = "";
        showToast("Hidden letter unlocked.");
      }
    }
  });
};

const hydrateFallbackImages = () => {
  document.querySelectorAll("[data-photo]").forEach((img, index) => {
    const memory = memories[index];
    if (!memory) {
      return;
    }
    img.src = fallbackArt(`Memory ${index + 1}`, memory.caption);
    img.alt = memory.caption;
  });

  finalPhoto.src = fallbackArt("Final memory", "See you in the next adventure.");
  finalPhoto.alt = "Final farewell memory";
};

const init = () => {
  renderAlbum();
  setupBackgroundMotion();
  setupObservers();
  setupInteractions();
  hydrateFallbackImages();
  updateTrackMeta();
  audioPlayer.volume = Number(volumeSlider.value);
};

init();
