import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { courseFile } from "../types";

export const handleFileDelete = (
  file: courseFile,
  currentUserId: string,
  selectedCourseId: string
) => {
  // Get ref to file in storage
  const fileStorageRef = ref(storage, file.fileReference);

  // Get ref to file in DB
  const fileFirestoreRef = doc(
    db,
    `users/${currentUserId}/courses/${selectedCourseId}/files/${file.id}`
  );
  const collectionFirestoreRef = collection(
    db,
    `users/${currentUserId}/courses/${selectedCourseId}/files/${file.id}/questions`
  );

  // Delete the file
  deleteObject(fileStorageRef)
    .then(async () => {
      const snapshot = await getDocs(collectionFirestoreRef);

      const deletePromises = snapshot.docs.map((doc) => {
        return deleteDoc(doc.ref);
      });

      await Promise.all(deletePromises);
    })
    .then(async () => {
      await deleteDoc(fileFirestoreRef);
    })
    .catch((error) => {
      console.error(`Error deleting file: ${file.fileName}`, error);
    });
};

export const handleCourseDelete = async (
  currentUserId: string,
  courseId: string
) => {
  try {
    // Get files for course
    const filesCollectionRef = collection(
      db,
      `users/${currentUserId}/courses/${courseId}/files`
    );

    const snapshot = await getDocs(filesCollectionRef);

    const files: courseFile[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        fileName: data.fileName,
        fileReference: data.fileReference,
        processed: data.processed,
        uploadedAt: data.uploadedAt,
      };
    });

    // Delete all the files of the course before deleting the course
    files.forEach((file) => handleFileDelete(file, currentUserId, courseId));

    // Get and delete course
    const courseDocRef = doc(db, `users/${currentUserId}/courses/${courseId}`);
    await deleteDoc(courseDocRef);
  } catch (error) {
    console.error(`Error deleting course: ${courseId}`, error);
  }
};
