import {
  onDocumentCreated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";

export const userSignup = onDocumentCreated("users/{userId}", (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  console.log("This user just signed up:", snapshot.data());
});

export const userDeleted = onDocumentDeleted("users/{userId}", (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  console.log("This user just got deleted:", snapshot.data());
});
