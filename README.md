# Svelte Time Tracker App

Visit the demo at [svelte-time-tracker-app.web.app](https://svelte-time-tracker-app.web.app/).
Go ahead and create an account to gain access to all functionalities (a fake email may be used, don't worry).

## Dependencies

- [Node.js](https://nodejs.org)

## Get started

Install the dependencies...

```bash
cd svelte-time-tracker-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see the app running. Edit any file under `/src`, and save it to see your changes. The page will reload automatically.

If you're using [Visual Studio Code](https://code.visualstudio.com/) install the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Firebase Firestore

This projetc is built using [Firebase](https://console.firebase.google.com)

Create a new project in your Firebase account. Enable Authentication with e-mail method, Firestore Database and Hosting.

For the Firestore rules, use our base sample at `/filestoreRules.js` for basic access rules on the existing pages.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in the package.json's `dependencies`.

## Deploy

Install [firebase-tools](https://firebase.google.com/docs/cli?hl=en) if you haven't already:

```bash
npm install -g firebase-tools
```

Then, from within the project folder, log in to Firebase with your Google credentials and set the project:

```bash
firebase login
firebase use *project-id*
```

After that, you can go ahead and deploy the application to production with:

```bash
firebase deploy

```
