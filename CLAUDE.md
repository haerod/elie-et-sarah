# Contexte du projet : site du mariage d'Elie & Sarah

## Le besoin

Site de mariage informatif + RSVP, compatible PC et mobile, bilingue FR/EN, public. Thème automne, style aquarelle moderne. Les illustrations seront **achetées** (kit PNG transparent, Etsy ou équivalent), jamais générées par IA. Les textes actuels sont des modèles : les mariés réécriront les leurs. Délai : au plus vite. Hébergement gratuit : GitHub Pages (Orange ne propose plus d'hébergement, Pages Perso fermé le 05.09.2023).

## Les infos fixes

- Mariés : Elie & Sarah. Contact : sarah.elie.famille@gmail.com (publié sur le site, à leur demande).
- Date : samedi 16.10.2027, début à 14h. Brunch facultatif le dimanche 17.10.2027.
- Lieu unique : Domaine de la Grande Canague, Montady (Hérault), https://domainelagrandecanague.fr/
- Environ 100 invités, tous invités à tout. Le brunch est seulement pour ceux qui le veulent.
- Tipis sur place, réservés et payés par les invités directement auprès du domaine.
- Programme volontairement peu détaillé.
- Liste de mariage : pas encore décidée.

## Choix techniques

- Statique, HTML/CSS/JS pur, sans build ni framework.
- `index.html` : toutes les sections (accueil + compte à rebours, programme, lieu + carte, hébergement, RSVP, liste de mariage, FAQ, contact).
- `js/i18n.js` : tous les textes dans `window.TRANSLATIONS.fr` / `.en`. Le HTML les référence avec `data-i18n`, `data-i18n-html`, `data-i18n-placeholder` et `data-i18n-aria`. Une clé manquante lève une erreur (fail fast, voulu).
- `js/main.js` : choix de la langue (localStorage puis langue du navigateur), menu mobile, compte à rebours vers `2027-10-16T14:00:00+02:00`, envoi du RSVP.
- RSVP : `fetch` POST en `text/plain` (pour éviter le preflight CORS) vers un Web App Google Apps Script (`apps-script/Code.gs`), qui ajoute une ligne dans l'onglet `RSVP` d'un Google Sheet. Un champ honeypot `website` filtre les bots. `RSVP_ENDPOINT` est encore vide dans `main.js` : tant qu'il l'est, le formulaire affiche un message « non configuré ». La procédure de branchement est dans le README.
- `css/style.css` : variables de couleur sur `:root`, mode sombre via `prefers-color-scheme` et `[data-theme]`. Palette : crème #fbf5ec, terracotta #b5552b, moutarde #c9922e, bordeaux #7a2e2a, olive #5e6b3f. Polices Google Fonts : Parisienne (prénoms), Cormorant Garamond (titres), Nunito Sans (texte). Menu burger sous 820px.
- Ornement de feuilles SVG provisoire dans le hero (`<symbol id="leaf">`), à remplacer par les illustrations achetées dans `assets/`.

## Conventions

- Réponses à l'utilisateur en français. Code et commentaires en anglais.
- Simple, pas de fallback, pas de sur-ingénierie. Modifications ciblées.
- Dates au format JJ.MM.AAAA dans les textes FR.
- Tester en local avec `python3 -m http.server 8000`, en vérifiant le mobile (~390px) et le desktop, en FR et en EN.

## Fait

- Site complet avec textes modèles FR/EN (commits `c259f9c`, `a134f0a`).
- Problèmes visuels corrigés : taille et rognage des feuilles SVG, labels radio, « 14h00 » non traduit, contraste du footer en mode sombre.

## Reste à faire

1. Créer le dépôt GitHub public (ex. `elie-et-sarah`) et pousser `main`. Puis activer **Settings > Pages > Deploy from a branch > main / (root)**. URL : `https://<pseudo>.github.io/elie-et-sarah/`.
2. Intégrer le kit aquarelle quand il sera acheté : couronne ou cadre pour le hero, bouquet d'angle ou guirlande, feuilles isolées. Adapter la palette aux couleurs du kit si besoin.
3. Déployer le Apps Script et renseigner `RSVP_ENDPOINT`.
4. Numéros des témoins (actuellement `06 00 00 00 00` dans la section Contact).
5. Confirmer la date limite RSVP (15.08.2027 en exemple, dans `rsvp.intro` et `faq.a4`).
6. Liste de mariage.
7. Vérifier les infos d'accès (adresse exacte, gare, aéroport, parking), qui ont été rédigées sans pouvoir consulter le site du domaine.
