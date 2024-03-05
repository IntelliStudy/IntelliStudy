/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export { userSignup } from './addUser';
export { testTrigger } from './testTrigger';

// export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
// export FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
