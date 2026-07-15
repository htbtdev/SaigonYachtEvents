# État du projet — Saigon Yacht Events

Récapitulatif pour reprendre le projet depuis n'importe quel appareil.
Dernière mise à jour : juillet 2026.

---

## 🌐 Le site en ligne

- **Production** : https://saigonyachtevents.com (et `www.`)
- **Page vietnamienne** : https://saigonyachtevents.com/vi.html
- **Miroir GitHub Pages** : https://htbtdev.github.io/SaigonYachtEvents/
- **Dépôt Git** : https://github.com/htbtdev/SaigonYachtEvents

Le site est **statique** (HTML/CSS/JS, sans serveur ni base de données).

---

## 📍 Où on en est (phases)

- **Phase 0 — Récupérer le site : ✅ terminée et en ligne.**
  Reproduction fidèle du site d'origine (export Framer) en HTML/CSS statique,
  puis améliorations (voir plus bas). Publié sur le domaine.
- **Phase 1 — Améliorations : à venir.** Pistes possibles : SEO/Open Graph,
  formulaire de contact, section tarifs, relecture des traductions VI par
  Ms. Thu, compression auto des nouveaux médias.

**Hébergement Hostinger** : abonnement du domaine + emails courant jusqu'à
~mars 2027. Le site web est désormais servi par GitHub Pages (gratuit), pas
par Hostinger.

---

## 🗂️ Structure du projet

```
.
├── index.html            # Accueil (anglais)
├── vi.html               # Version vietnamienne
├── site.webmanifest      # Manifeste PWA (icône Android/écran d'accueil)
├── apple-touch-icon.png  # Icône iPhone (fallback racine)
├── update-photos.bat     # ⭐ à double-cliquer après avoir ajouté des photos
├── css/style.css         # Tous les styles
├── assets/
│   ├── site.js           # Tout le JavaScript (carrousel, galerie, lightbox…)
│   ├── photos.js         # Liste des photos (GÉNÉRÉE — ne pas éditer)
│   └── img/
│       ├── Page1/        # Carrousel : photos (.webp) + clips (.mp4)
│       ├── Services/     # decoration/food/special .webp (3 fixes)
│       ├── Gallery/      # Galerie : photos (.webp) + vidéos (.mp4)
│       └── posters/      # Aperçus des vidéos (générés)
├── tools/generate-photos.js  # Génère assets/photos.js
├── Photos/               # 📦 Sources photo haute résolution (non publiées)
├── Videos/               # 📦 Sources vidéo brutes (non publiées)
├── Prototypes/           # Maquettes/pistes de design
└── site original/        # Copie du site d'origine (référence)
```

Le déploiement (`.github/workflows/deploy.yml`) ne publie que le site : les
dossiers `Photos/`, `Videos/`, `Prototypes/`, `site original/` restent privés.

---

## ➕ Ajouter / changer des photos et vidéos

Les deux langues (EN et VI) utilisent **les mêmes médias**.

1. Déposer les fichiers dans le bon dossier :
   - **Carrousel 1ʳᵉ page** → `assets/img/Page1/` (photos + clips vidéo courts)
   - **Galerie** → `assets/img/Gallery/` (photos + vidéos)
   - Ordre d'affichage = alphabétique → nommer `01`, `02`, `03`…
2. **Double-cliquer sur `update-photos.bat`** (régénère `assets/photos.js`)
3. `git add -A && git commit && git push` → le site se met à jour tout seul (1-2 min)

- **Services** : 3 photos fixes — remplacer le fichier en gardant son nom
  (`decoration.webp`, `food.webp`, `special.webp`), pas besoin du .bat.
- **Légendes des polaroids** (galerie) : dans `assets/site.js` (EN) et en haut de
  `vi.html` (VI). Clé = nom du fichier **sans extension** (`01`, `17-clip`…).

> ⚡ **Optimisation** : les images existantes sont en WebP redimensionné et les
> vidéos ont un poster (chargement initial < 1 Mo). Les nouveaux fichiers JPG/MP4
> bruts marcheront, mais pour rester léger il vaut mieux les faire optimiser
> (conversion WebP + poster) — outils utilisés : `sharp` et `ffmpeg-static` (npm).

---

## ✨ Fonctionnalités en place

- Hero avec image de fond + parallaxe (desktop), texte en cascade, paillettes dorées
- Carrousel de cadres penchés (photos + clips vidéo muets, lecture paresseuse)
- Section Services (style élégant, apparition au scroll)
- Galerie « mur de polaroids » en désordre, légendes manuscrites EN/VI
- Visionneuse (lightbox) avec effet pile de polaroids + navigation + vidéos
- En-tête transparent → opaque au scroll ; menu **hamburger** sur mobile
- Bilingue EN/VI ; icône écran d'accueil = visage de Ms. Thu
- Typographie Playfair Display + Nunito Sans (+ Caveat/Dancing Script manuscrites)

---

## 🚀 Déploiement & domaine

- **Auto-déploiement** : chaque `git push` sur `main` publie le site via GitHub
  Actions → GitHub Pages. Rien à faire manuellement.
- **DNS (chez Hostinger)** : racine `@` (ALIAS) et `www` (CNAME) pointent vers
  `htbtdev.github.io`. HTTPS géré par GitHub.
- **⚠️ Emails préservés** : les enregistrements MX (`mx1`/`mx2.hostinger.com`),
  SPF, DKIM, DMARC sont intacts → `contact@saigonyachtevents.com` fonctionne.
  Ne jamais toucher à ces lignes DNS.

---

## 🔁 Reprendre sur un autre appareil

```bash
git clone https://github.com/htbtdev/SaigonYachtEvents.git
cd SaigonYachtEvents
```
Pour prévisualiser en local : `npx http-server -p 8901 -c-1` puis ouvrir
http://127.0.0.1:8901/index.html

Note : l'historique de conversation Claude Code reste local à chaque machine ;
ce fichier + les messages de commit servent de mémoire partagée du projet.
