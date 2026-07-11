// Scripts du site — partagés par index.html et vi.html
// (nécessite assets/photos.js chargé avant)
(function () {
  var P = window.SITE_PHOTOS || { page1: [], gallery: [] };

  /* ---------- Page1 : carrousel lent des cadres penchés ----------
     Photos ET clips vidéo (mp4/webm) — les vidéos jouent en boucle, sans son. */
  function makeMedia(src) {
    if (/\.(mp4|webm)$/i.test(src)) {
      var v = document.createElement('video');
      v.src = src;
      v.muted = true; v.loop = true; v.autoplay = true;
      v.setAttribute('muted', '');          // nécessaire pour l'autoplay mobile
      v.setAttribute('playsinline', '');    // pas de plein écran forcé sur iOS
      v.preload = 'auto';
      // relance la lecture dès que la vidéo est prête (l'autoplay seul est parfois ignoré)
      v.addEventListener('canplay', function () {
        if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
      return v;
    }
    var img = document.createElement('img');
    img.src = src; img.alt = 'saigonyachtevents'; img.loading = 'lazy';
    return img;
  }

  var collage = document.querySelector('.collage');
  if (collage && P.page1.length) {
    // nombre pair d'éléments pour que le décalage haut/bas reste cohérent à la boucle
    var set = P.page1.length % 2 ? P.page1.concat(P.page1) : P.page1;
    var track = document.createElement('div');
    track.className = 'collage-track';
    // deux jeux identiques à la suite : quand le premier est sorti de l'écran,
    // on est exactement au début du second → boucle invisible
    set.concat(set).forEach(function (src) { track.appendChild(makeMedia(src)); });
    track.style.animationDuration = (set.length * 7) + 's'; // ~7 s par visuel
    collage.appendChild(track);
    // certains navigateurs ignorent l'attribut autoplay : on force la lecture,
    // et on relance quand l'onglet redevient visible (Chrome met en pause les
    // vidéos des pages masquées)
    var playAll = function () {
      track.querySelectorAll('video').forEach(function (v) {
        if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    };
    playAll();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') playAll();
    });
  }

  /* ---------- Gallery (grille) : photos + vidéos ---------- */
  function isVideo(src) { return /\.(mp4|webm)$/i.test(src); }

  /* Légendes manuscrites des polaroids — modifiez librement ici.
     Clé = nom du fichier dans assets/img/Gallery. Les fichiers sans
     légende reçoivent une phrase de la réserve ci-dessous. */
  var CAPTIONS = {
    '01.jpg': 'Love is in the air',
    '02.jpg': 'She said yes!',
    '03.jpg': 'Just the two of us',
    '04.jpg': 'Forever starts here',
    '05.jpg': 'Girls night!',
    '06.jpg': 'Happy birthday!',
    '07.jpg': 'Party time!',
    '08.jpg': 'Glam squad',
    '09.jpg': 'Boys trip',
    '10.jpg': 'What a party!',
    '11.jpg': 'Night to remember',
    '12.jpg': 'Golden hour',
    '13.jpg': 'Make a wish!',
    '14.jpg': 'Family day',
    '15.jpg': "Chef's magic",
    '16.jpg': 'Bon appétit!',
    '17-clip.mp4': 'Cheers!',
    '18-clip.mp4': 'Saigon by night',
    '19-clip.mp4': 'Birthday cruise',
    '20-clip.mp4': 'White party!'
  };
  var CAPTION_POOL = ['Memories', 'Good vibes', 'What a day!', 'On the river'];

  // pseudo-aléatoire déterministe : le même désordre à chaque visite
  function rnd(seed) { var x = Math.sin(seed * 12.9898) * 43758.5453; return x - Math.floor(x); }

  var DELAYS = ['', 'd1', 'd2', 'd3']; // apparition en cascade, comme le proto
  var grid = document.querySelector('.grid');
  P.gallery.forEach(function (src, i) {
    var a = document.createElement('a');
    a.href = src;
    a.className = ('reveal ' + DELAYS[i % 4]).trim();
    // désordre naturel : chaque polaroid a sa rotation et ses décalages propres
    a.style.setProperty('--rot', (rnd(i + 1) * 11 - 5.5).toFixed(2) + 'deg');  // -5,5° à +5,5°
    a.style.setProperty('--ty',  (rnd(i + 13) * 32 - 16).toFixed(1) + 'px');   // -16 à +16 px
    a.style.setProperty('--tx',  (rnd(i + 29) * 24 - 12).toFixed(1) + 'px');   // -12 à +12 px
    a.addEventListener('click', function (e) { e.preventDefault(); openLightbox(i); });
    if (isVideo(src)) {
      // vignette vidéo : première image seulement (léger), badge ▶ via CSS
      a.classList.add('is-video');
      var v = document.createElement('video');
      v.src = src + '#t=0.1'; // force l'affichage de la première image
      v.preload = 'metadata';
      v.muted = true;
      v.setAttribute('playsinline', '');
      a.appendChild(v);
    } else {
      var img = document.createElement('img');
      img.src = src; img.alt = 'saigonyachtevents'; img.loading = 'lazy';
      a.appendChild(img);
    }
    // légende manuscrite du polaroid — inclinaison propre à chacune
    var name = src.split('/').pop();
    var cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = CAPTIONS[name] || CAPTION_POOL[i % CAPTION_POOL.length];
    cap.style.transform = 'rotate(' + (rnd(i + 47) * 6 - 3).toFixed(2) + 'deg)';
    a.appendChild(cap);
    grid.appendChild(a);
  });

  /* ---------- lightbox (fermer, précédente/suivante) ---------- */
  var lb = null, lbImg, lbVideo, lbCounter, current = 0;

  function build() {
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Fermer">&times;</button>' +
      '<button class="lb-prev" aria-label="Photo précédente">&#10094;</button>' +
      '<img alt="saigonyachtevents" />' +
      '<video controls playsinline style="display:none"></video>' +
      '<button class="lb-next" aria-label="Photo suivante">&#10095;</button>' +
      '<div class="lb-counter"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbVideo = lb.querySelector('video');
    lbCounter = lb.querySelector('.lb-counter');

    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });

    // clic en dehors de la photo → fermer
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

    // clavier : Échap ferme, flèches naviguent
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });

    // swipe tactile (mobile)
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (dx > 40) show(current - 1);
      else if (dx < -40) show(current + 1);
    }, { passive: true });
  }

  function show(i) {
    var n = P.gallery.length;
    if (!n) return;
    current = (i + n) % n; // boucle : après la dernière, revient à la première
    var src = P.gallery[current];
    // on met en pause la vidéo précédente avant de changer de visuel
    lbVideo.pause();
    if (isVideo(src)) {
      lbImg.style.display = 'none';
      lbVideo.style.display = '';
      lbVideo.src = src;
      var p = lbVideo.play();
      if (p && p.catch) p.catch(function () {}); // lecture auto, contrôles dispo
    } else {
      lbVideo.removeAttribute('src');
      lbVideo.style.display = 'none';
      lbImg.style.display = '';
      lbImg.src = src;
    }
    lbCounter.textContent = (current + 1) + ' / ' + n;
  }

  function openLightbox(i) {
    if (!lb) build();
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden'; // bloque le scroll derrière
  }

  function close() {
    lbVideo.pause(); // coupe la lecture en quittant la visionneuse
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- paillettes flottantes du hero (effet de la maquette) ---------- */
  var hero = document.querySelector('.hero');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && !reduceMotion) {
    var lights = document.createElement('div');
    lights.className = 'lights';
    for (var i = 0; i < 28; i++) {
      var d = document.createElement('span');
      d.className = 'light';
      var s = 3 + Math.random() * 7;                          // taille 3-10 px
      d.style.width = s + 'px';
      d.style.height = s + 'px';
      d.style.left = (Math.random() * 100) + '%';             // position horizontale
      d.style.animationDuration = (9 + Math.random() * 12) + 's'; // montée 9-21 s
      d.style.animationDelay = (Math.random() * 10) + 's';    // départs étalés
      lights.appendChild(d);
    }
    hero.insertBefore(lights, hero.firstChild);
  }

  /* ---------- menu déroulant de langue ---------- */
  var lang = document.getElementById('lang');
  var btn = lang.querySelector('.lang-btn');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    lang.classList.toggle('open');
    btn.setAttribute('aria-expanded', lang.classList.contains('open'));
  });
  document.addEventListener('click', function () { lang.classList.remove('open'); });

  /* ---------- apparition au scroll (reveal du proto3) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- header opaque au scroll (comme l'original) ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
