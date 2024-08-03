import { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  courseCode: string;
  courseName?: string;
  userId: string;
  createdAt: Timestamp;
};

export type courseFile = {
  fileName: string;
  fileReference: string;
  uploadedAt: Timestamp;
  processed: boolean;
};
