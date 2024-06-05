import { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  courseCode: string;
  courseName?: string;
  filesRef: FileRef[];
  userId: string;
  createdAt: Timestamp;
};

export type FileRef = {
  fileName: string;
  fileReference: string;
  uploadedAt: Timestamp;
};
