// Scripts du site — partagés par index.html et vi.html
// (nécessite assets/photos.js chargé avant)
(function () {
  var P = window.SITE_PHOTOS || { page1: [], gallery: [] };

  /* ---------- rechargement toujours en haut de page ----------
     Chrome restaure la position de scroll au F5, mais comme le carrousel
     est construit en JS et que les polices chargent après, la position
     restaurée tombe à côté (léger scroll parasite). On désactive. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------- Page1 : carrousel lent des cadres penchés ----------
     Photos ET clips vidéo (mp4/webm) — les vidéos jouent en boucle, sans son. */
  function posterFor(src) {
    return 'assets/img/posters/' + src.split('/').pop().replace(/\.[^.]+$/, '') + '.webp';
  }
  function makeMedia(src) {
    if (/\.(mp4|webm)$/i.test(src)) {
      var v = document.createElement('video');
      // chargement paresseux : la vraie source n'est posée que quand le cadre
      // devient visible (voir l'observer plus bas). L'image poster s'affiche
      // en attendant → aucune vidéo téléchargée au démarrage.
      v.dataset.src = src;
      v.poster = posterFor(src);
      v.muted = true; v.loop = true;
      v.setAttribute('muted', '');          // nécessaire pour l'autoplay mobile
      v.setAttribute('playsinline', '');    // pas de plein écran forcé sur iOS
      v.preload = 'none';
      v.addEventListener('canplay', function () {
        if (v.dataset.visible === '1' && v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
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
    set.concat(set).forEach(function (src, idx) {
      var el = makeMedia(src);
      // apparition progressive : un cadre toutes les 0,65 s après le texte,
      // pour laisser le temps d'admirer le fond
      el.style.animationDelay = (1.2 + (idx % set.length) * 0.65).toFixed(2) + 's';
      track.appendChild(el);
    });
    track.style.animationDuration = (set.length * 7) + 's'; // ~7 s par visuel
    collage.appendChild(track);

    // chaque clip ne se charge et ne joue que lorsqu'il est visible à l'écran ;
    // dès qu'il sort, on met en pause → seuls 2-3 clips chargent au démarrage
    var videos = track.querySelectorAll('video');
    if (videos.length) {
      var playVisible = function (v) {
        if (!v.src) v.src = v.dataset.src; // pose la vraie source au premier passage
        if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      };
      if ('IntersectionObserver' in window) {
        var vObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            var v = e.target;
            if (e.isIntersecting) { v.dataset.visible = '1'; playVisible(v); }
            else { v.dataset.visible = ''; v.pause(); }
          });
        }, { root: null, rootMargin: '150px', threshold: 0.01 });
        videos.forEach(function (v) { vObs.observe(v); });
      } else {
        videos.forEach(function (v) { v.dataset.visible = '1'; playVisible(v); });
      }
      // au retour sur l'onglet, on relance les clips visibles
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
          videos.forEach(function (v) { if (v.dataset.visible === '1') playVisible(v); });
        }
      });
    }
  }

  /* ---------- Gallery (grille) : photos + vidéos ---------- */
  function isVideo(src) { return /\.(mp4|webm)$/i.test(src); }

  /* Légendes manuscrites des polaroids — modifiez librement ici.
     Clé = nom du fichier dans assets/img/Gallery. Les fichiers sans
     légende reçoivent une phrase de la réserve ci-dessous.
     La page VI définit ses propres légendes via window.GALLERY_CAPTIONS. */
  // clés = nom du fichier SANS extension (marche pour .jpg, .webp, .mp4…)
  var CAPTIONS = window.GALLERY_CAPTIONS || {
    '01': 'Love is in the air',
    '02': 'She said yes!',
    '03': 'Just the two of us',
    '04': 'Forever starts here',
    '05': 'Girls night!',
    '06': 'Happy birthday!',
    '07': 'Party time!',
    '08': 'Glam squad',
    '09': 'Boys trip',
    '10': 'What a party!',
    '11': 'Night to remember',
    '12': 'Golden hour',
    '13': 'Make a wish!',
    '14': 'Family day',
    '15': "Chef's magic",
    '16': 'Bon appétit!',
    '17-clip': 'Cheers!',
    '18-clip': 'Saigon by night',
    '19-clip': 'Birthday cruise',
    '20-clip': 'White party!'
  };
  var CAPTION_POOL = window.GALLERY_CAPTION_POOL || ['Memories', 'Good vibes', 'What a day!', 'On the river'];

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
      // vignette vidéo = image poster (légère), badge ▶ via CSS.
      // La vraie vidéo n'est chargée qu'au clic (dans la visionneuse).
      a.classList.add('is-video');
      var img = document.createElement('img');
      img.src = posterFor(src); img.alt = 'saigonyachtevents'; img.loading = 'lazy';
      a.appendChild(img);
    } else {
      var img = document.createElement('img');
      img.src = src; img.alt = 'saigonyachtevents'; img.loading = 'lazy';
      a.appendChild(img);
    }
    // légende manuscrite du polaroid — inclinaison propre à chacune
    var cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = captionFor(src, i);
    cap.style.transform = 'rotate(' + (rnd(i + 47) * 6 - 3).toFixed(2) + 'deg)';
    a.appendChild(cap);
    grid.appendChild(a);
  });

  /* ---------- lightbox polaroid (pile + étalage) ---------- */
  var lb = null, lbBackdrop, lbImg, lbVideo, lbCap, lbCounter, current = 0;

  function baseName(src) { return src.split('/').pop().replace(/\.[^.]+$/, ''); }
  function captionFor(src, i) {
    return CAPTIONS[baseName(src)] || CAPTION_POOL[i % CAPTION_POOL.length];
  }

  // au clic : tous les polaroids de la grille volent vers le centre → pile
  function pileUp() {
    if (reduceMotion) return;
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    grid.querySelectorAll('a').forEach(function (el, k) {
      var r = el.getBoundingClientRect();
      el.classList.add('in');      // même les vignettes pas encore révélées rejoignent la pile
      el.classList.add('piling');
      el.style.zIndex = 90;        // au-dessus du voile (80), sous le grand polaroid (100)
      el.style.transform = 'translate(' +
        (cx - (r.left + r.width / 2)).toFixed(0) + 'px,' +
        (cy - (r.top + r.height / 2)).toFixed(0) + 'px) ' +
        'rotate(' + (rnd(k + 61) * 24 - 12).toFixed(1) + 'deg) scale(.55)';
    });
  }

  // à la fermeture : la pile s'éparpille, chacun retourne à sa place
  function spreadOut() {
    grid.querySelectorAll('a').forEach(function (el) {
      el.style.transform = ''; // retour à la rotation/décalage CSS d'origine
      setTimeout(function () {
        el.classList.remove('piling');
        el.style.zIndex = '';
      }, 700);
    });
  }

  function build() {
    lbBackdrop = document.createElement('div');
    lbBackdrop.className = 'lb-backdrop';
    document.body.appendChild(lbBackdrop);
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Fermer">&times;</button>' +
      '<button class="lb-prev" aria-label="Photo précédente">&#10094;</button>' +
      '<div class="lb-stage">' +
        // bordures de la pile qui dépassent sous le polaroid sélectionné
        '<div class="lb-pile"><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="lb-polaroid">' +
          '<img alt="saigonyachtevents" />' +
          '<video controls playsinline style="display:none"></video>' +
          '<span class="lb-cap"></span>' +
        '</div>' +
      '</div>' +
      '<button class="lb-next" aria-label="Photo suivante">&#10095;</button>' +
      '<div class="lb-counter"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbVideo = lb.querySelector('video');
    lbCap = lb.querySelector('.lb-cap');
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
    lbCap.textContent = captionFor(src, current); // la légende manuscrite suit
    lbCounter.textContent = (current + 1) + ' / ' + n;
  }

  function openLightbox(i) {
    if (!lb) build();
    show(i);
    pileUp(); // les autres polaroids se rassemblent en pile
    lbBackdrop.classList.add('open');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden'; // bloque le scroll derrière
  }

  function close() {
    lbVideo.pause(); // coupe la lecture en quittant la visionneuse
    lb.classList.remove('open');
    lbBackdrop.classList.remove('open');
    spreadOut(); // la pile s'éparpille, chaque polaroid retourne à sa place
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

  /* Le fond figé du hero (.hero-bg) est géré entièrement en CSS
     (position: fixed) — aucun JavaScript nécessaire. */

  /* ---------- menu mobile (hamburger) ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteHeader = document.querySelector('.site-header');
  if (navToggle && siteHeader) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = siteHeader.classList.toggle('menu-open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });
    // clic ailleurs sur la page → le menu se referme
    document.addEventListener('click', function () {
      siteHeader.classList.remove('menu-open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
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
