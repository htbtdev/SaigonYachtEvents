@echo off
rem Regenere la liste des photos du site (assets/photos.js)
rem apres avoir ajoute/supprime des photos dans :
rem   assets\img\Page1    (cadres penches de la premiere page)
rem   assets\img\Gallery  (grille de la galerie)
cd /d "%~dp0"
node tools\generate-photos.js
echo.
pause
