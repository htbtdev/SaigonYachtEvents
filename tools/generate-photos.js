// Génère assets/photos.js à partir du contenu des dossiers d'images.
// À relancer après avoir ajouté/supprimé des photos :
//   - double-clic sur update-photos.bat (à la racine du projet)
//   - ou : node tools/generate-photos.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;
const MEDIA = /\.(jpe?g|png|webp|avif|gif|mp4|webm)$/i; // Page1 accepte aussi les vidéos

function list(dir, re) {
  const abs = path.join(ROOT, 'assets', 'img', dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter(f => re.test(f))
    .sort()
    .map(f => 'assets/img/' + dir + '/' + f);
}

const data = {
  page1: list('Page1', MEDIA),    // cadres penchés (photos + clips vidéo mp4/webm)
  gallery: list('Gallery', MEDIA), // grille de la galerie (photos + vidéos)
};

const out =
  '// Fichier généré par tools/generate-photos.js — NE PAS ÉDITER À LA MAIN.\n' +
  '// Ajoutez vos photos dans assets/img/Page1 ou assets/img/Gallery,\n' +
  '// puis double-cliquez sur update-photos.bat pour régénérer ce fichier.\n' +
  'window.SITE_PHOTOS = ' + JSON.stringify(data, null, 2) + ';\n';

fs.writeFileSync(path.join(ROOT, 'assets', 'photos.js'), out);
console.log('photos.js généré : ' + data.page1.length + ' photo(s) Page1, ' + data.gallery.length + ' photo(s) Gallery');
