# Bhanu Prasad Merakanapalli Portfolio

https://calmindian-33.web.app/

## Local development

The portfolio can run without Firebase configuration, but chat and admin chat
will be unavailable. To enable them, create a `.env` file in the repository
root with the Firebase web app settings:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

Restart the development server after changing `.env`. An `auth/invalid-api-key`
error means the configured API key is missing or does not match the Firebase
project; check the value in `.env` locally and the
`REACT_APP_FIREBASE_API_KEY` GitHub Actions secret for deployed builds.

## Chat security setup

Deploy the Firestore security rules and required query index:

```sh
firebase deploy --only firestore:rules,firestore:indexes
```

Admin access uses a Firebase Authentication custom claim. Assign the `admin`
claim only from a trusted environment with the Firebase Admin SDK and
credentials authorized to manage users in the `calmindian-33` project. Never
put service-account credentials in this repository or in the browser app.

For example, in a trusted Node.js environment where `firebase-admin` is
installed and Application Default Credentials are configured:

```js
const { applicationDefault, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

initializeApp({
  credential: applicationDefault(),
  projectId: "calmindian-33",
});

async function grantAdmin(email) {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, {
    ...user.customClaims,
    admin: true,
  });
}
```

Call `grantAdmin` with the intended administrator's email. To revoke admin
access, set `admin: false` for that user while preserving their other custom
claims. The user must sign in again or refresh their ID token before the new
claim takes effect.

Firestore rules restrict users to chat documents whose `sender` matches their
verified Firebase email. Admin reads and replies require the verified `admin`
claim; the checks in the React app are only for presentation and are not the
security boundary.