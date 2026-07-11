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
├── css/
│   └── style.css         # Styles
├── assets/
│   └── img/              # Logo, favicon, hero, services, icônes
│       └── gallery/      # Galerie photos
├── Photos/               # Sources photo haute résolution
└── site original/        # Copie du site d'origine (référence)
```

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
