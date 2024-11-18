import { Timestamp } from "firebase/firestore";

export type Course = {
  id: string;
  courseCode: string;
  courseName?: string;
  userId: string;
  createdAt: Timestamp;
};

export type CourseFile = {
  id: string;
  fileName: string;
  fileReference: string;
  uploadedAt: Timestamp;
  processed: boolean;
};

export type User = {
  displayName: string;
  email: string;
  fName: string;
  lName: string;
  password: string;
  signedIn: boolean;
  uid: string;
  uploadedFiles: boolean;
};
