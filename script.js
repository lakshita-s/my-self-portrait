// Each button with class "win95-launcher" opens the panel whose id
// matches its data-target attribute. Panels dock in place (see CSS)
// and stay open until their own close button is clicked — no overlay,
// no click-outside-to-close, and multiple panels can be open at once.

document.querySelectorAll(".win95-launcher").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const panel = document.getElementById(btn.dataset.target);
    if (panel) panel.classList.add("open");
  });
});

document.querySelectorAll(".win95-window .close").forEach(function (closeBtn) {
  closeBtn.addEventListener("click", function () {
    const panel = closeBtn.closest(".panel");
    if (panel) panel.classList.remove("open");
  });
});

// Insert-button behavior — unchanged
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("insert-btn")) {
    const button = event.target;
    const newText = button.getAttribute("data-insert");

    const newSpan = document.createElement("span");
    newSpan.classList.add("inserted-text");
    newSpan.textContent = newText;

    button.replaceWith(newSpan);
  }
});

document.querySelectorAll(".tooltip").forEach(function (tip) {
  const text = tip.querySelector(".tooltip-text");
  if (!text) return;

  tip.addEventListener("mouseenter", function () {
    text.classList.remove("arrow-up", "arrow-down");
    text.classList.add("visible");

    const anchorRect = tip.getBoundingClientRect();
    const w = text.offsetWidth;
    const h = text.offsetHeight;
    const margin = 8; // gap kept from the viewport edges

    let top = anchorRect.top - h - 10; // default: above the word
    let arrow = "arrow-down";
    if (top < margin) {
      top = anchorRect.bottom + 10; // not enough room above — flip below
      arrow = "arrow-up";
    }

    let left = anchorRect.left + anchorRect.width / 2 - w / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));

    text.style.top = `${top}px`;
    text.style.left = `${left}px`;
    text.classList.add(arrow);
  });

  tip.addEventListener("mouseleave", function () {
    text.classList.remove("visible");
  });
});

// Media player
const tracks = [
  {
    src: "assets/songs/slacker.mp3",
    img: "assets/flower-ascii.png",
    artist: "Dean Blunt",
    title: "Slacker",
  },
  {
    src: "assets/songs/sweeter.mp3",
    img: "assets/siv-ascii.png",
    artist: "Julie Doiron",
    title: "Sweeter",
  },
  {
    src: "assets/songs/best-to-you.mp3",
    img: "assets/us-ascii.png",
    artist: "Blood Orange",
    title: "Best To You",
  },
  {
    src: "assets/songs/cell-phone-says.mp3",
    img: "assets/parents-ascii.png",
    artist: "Adrianne Lenker",
    title: "Cell Phone Says",
  },
  {
    src: "assets/songs/still.mp3",
    img: "assets/ind-ascii.png",
    artist: "You'll Never Get to Heaven",
    title: "Still",
  },
  {
    src: "assets/songs/bluebird.mp3",
    img: "assets/gi-ascii.png",
    artist: "Beach House",
    title: "Bluebird",
  },
];
let currentTrack = 0;
let playing = false;// starts paused

const audioPlayer = document.getElementById("audioPlayer");
const albumArt = document.getElementById("albumArt");
const artistValue = document.getElementById("artistValue");
const titleValue = document.getElementById("titleValue");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");

function updatePlayPauseIcon() {
  if (!playPauseBtn || !playPauseIcon) return;
  playPauseBtn.classList.toggle("active", playing);
  playPauseIcon.innerHTML = playing
    ? '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>'
    : '<path d="M7 5l12 7-12 7z"/>';
}

function loadTrack(index, autoplay) {
  const track = tracks[index];
  if (albumArt) {
    albumArt.src = track.img;
    albumArt.alt = `${track.title} — ${track.artist}`;
  }
  if (artistValue) artistValue.textContent = track.artist;
  if (titleValue) titleValue.textContent = track.title;
  if (audioPlayer) {
    audioPlayer.src = track.src;
    if (autoplay) {
      audioPlayer.play().catch(() => {});// ignore failures (e.g. placeholder path)
    }
  }
}

if (playPauseBtn && playPauseIcon && audioPlayer) {
  loadTrack(currentTrack, false); // load the first track, stay paused
  updatePlayPauseIcon();

  playPauseBtn.addEventListener("click", () => {
    playing = !playing;
    if (playing) {
      audioPlayer.play().catch(() => {});
    } else {
      audioPlayer.pause();
    }
    updatePlayPauseIcon();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack, playing); // keep playing if it already was
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack, playing);
  });
}

const likeBtn = document.getElementById("likeBtn");
if (likeBtn) {
  likeBtn.addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("liked");
  });
}
