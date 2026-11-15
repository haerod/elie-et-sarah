# Site du mariage

Site statique (HTML, CSS, JS, sans build), bilingue FR/EN. Les réponses RSVP arrivent dans un Google Sheet.

## Structure

```
index.html          structure des pages
css/style.css       styles (couleurs en variables en haut du fichier)
js/i18n.js          TOUS les textes, en français et en anglais
js/main.js          langue, menu mobile, compte à rebours, envoi du RSVP
apps-script/Code.gs script à coller dans Google Sheets
assets/             illustrations (à venir)
```

Pour modifier un texte : `js/i18n.js`, même clé dans `fr` et `en`. Une clé manquante lève une erreur dans la console.

## Tester en local

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Brancher le RSVP (Google Sheets)

1. Créer un Google Sheet vide (ex. « Mariage RSVP »).
2. Menu **Extensions > Apps Script**, remplacer le contenu par `apps-script/Code.gs`, enregistrer.
3. **Déployer > Nouveau déploiement**, type **Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
4. Autoriser l'accès quand Google le demande, copier l'URL qui finit par `/exec`.
5. La coller dans `js/main.js` : `const RSVP_ENDPOINT = "https://script.google.com/macros/s/.../exec";`

L'onglet `RSVP` et ses en-têtes sont créés au premier envoi. Après une modification de `Code.gs`, il faut **Gérer les déploiements > Modifier > Nouvelle version**, sinon l'ancienne version reste en ligne.

## Mettre en ligne (GitHub Pages)

1. Créer un dépôt sur GitHub et pousser ce dossier.
2. **Settings > Pages > Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est en ligne quelques minutes plus tard sur `https://<utilisateur>.github.io/<depot>/`.

## À compléter

- Numéros des témoins (section Contact de `index.html`)
- Date limite RSVP (`rsvp.intro` et `faq.a4` dans `js/i18n.js`)
- Liste de mariage
- Illustrations : remplacer les feuilles SVG provisoires par les images retenues
- Infos d'accès à vérifier (adresse exacte, gare, aéroport)
