export type Course = {
  id: string;
  courseCode: string;
  courseName?: string;
  filesRef: FileRef[];
  userId: string;
};

export type FileRef = {
  fileName: string;
  fileReference: string;
};
