# Saigon Yacht Events

Refonte du site vitrine **Saigon Yacht Events** — location de yachts de luxe à Hô-Chi-Minh-Ville
(événements privés, anniversaires, sorties sur la rivière Saïgon).

Reproduction fidèle du site original en HTML/CSS statique, sans dépendance à un framework
(le site d'origine était un export Framer).

## Structure

```
.
├── index.html            # Page d'accueil (anglais)
├── vi.html               # Version vietnamienne (Tiếng Việt)
├── update-photos.bat     # À double-cliquer après avoir ajouté des photos
├── css/
│   └── style.css         # Styles
├── tools/
│   └── generate-photos.js  # Génère assets/photos.js (liste des photos)
├── assets/
│   ├── photos.js         # Liste des photos (générée — ne pas éditer)
│   └── img/              # Logo, favicon, fond du hero, icônes
│       ├── Page1/        # Photos des cadres penchés de la première page
│       ├── Services/     # decoration.jpg, food.jpg, special.jpg
│       └── Gallery/      # Photos de la galerie
├── Photos/               # Sources photo haute résolution
├── Videos/               # Sources vidéo (brutes, non publiées sur le site)
└── site original/        # Copie du site d'origine (référence)
```

## Ajouter / changer des photos et vidéos

Les deux langues (EN et VI) utilisent **les mêmes photos**.

- **Première page (carrousel de cadres penchés)** : déposer photos **et clips vidéo**
  (`.mp4` / `.webm`) dans `assets/img/Page1/` — défilement lent en boucle, pause au
  survol ; les vidéos jouent en boucle, sans son. Affichage par ordre alphabétique
  (nommer `01.jpg`, `02.jpg`… pour contrôler l'ordre).
  Conseil vidéo : clips courts (10-30 s), format portrait, compressés (quelques Mo).
  Les vidéos brutes (téléphone, caméra) vont dans `Videos/` à la racine — on en
  tire des clips compressés pour le site.
- **Galerie** : déposer photos **et vidéos** (`.mp4` / `.webm`) dans
  `assets/img/Gallery/` — **tout** le contenu du dossier est affiché automatiquement.
  Les vidéos ont un badge ▶ sur leur vignette et se lisent dans la visionneuse
  (avec les contrôles lecture/son)
- Puis **double-cliquer sur `update-photos.bat`** (régénère la liste `assets/photos.js`)
  et pousser sur git

- **Services** : 3 photos fixes — pour en changer une, remplacer le fichier en
  gardant son nom : `decoration.jpg`, `food.jpg` ou `special.jpg` (pas besoin du .bat)

## Sections

- **Header** — logo/contact (Ms. Thu · +84 932 094 907), navigation, sélecteur de langue EN/VI, Facebook
- **Hero** — titre, note 5 étoiles, accroche et collage photo
- **Services** — Décoration · Restauration · Demandes spéciales
- **Galerie** — 16 photos d'événements passés
- **Contact** — contact@saigonyachtevents.com

## Développement

Site 100 % statique — ouvrir `index.html` directement, ou servir le dossier :

```bash
npx http-server -p 8080
```

Puis ouvrir http://localhost:8080

## Personnalisation

- Textes : directement dans `index.html` / `vi.html`
- Couleurs & typographie : variables CSS en haut de `css/style.css`
- Photos : remplacer les fichiers dans `assets/img/` (mêmes noms)
- Polices : Outfit, DM Sans, Inter (Google Fonts)
