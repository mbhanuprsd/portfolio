# Bhanu Prasad Merakanapalli Portfolio

https://calmindian-33.web.app/

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