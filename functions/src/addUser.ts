
import {
    onDocumentUpdated
  } from "firebase-functions/v2/firestore";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const testTrigger = onDocumentUpdated("frontendTest/{wys}", (event) => {

    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data aEssociated with the event");
        return;
    }
    // if (event.data?.before.data().generate !== event.data?.after.data().generate) {
        console.log("It changed from the frontend!");
    // }


});