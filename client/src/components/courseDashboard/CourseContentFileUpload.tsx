import { Button, Flex, Text } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { db, storage } from '../../firebase/firebase';
import { Course } from '../../types';

interface props {
  selectedCourse: Course;
}

const CourseContentFileUpload = ({ selectedCourse }: props) => {
  // This state is only used to keep track of files that the user is uplaoding, not all the files they have uploaded in total
  const [filesToUpload, setFilesToUpload] = useState<FileWithPath[]>([]);
  const { currentUser } = useContext(UserContext);

  const previews = filesToUpload?.map((file, index) => {
    return <Text key={index}>{file.name}</Text>;
  });

  const handleDrop = (newFiles: FileWithPath[]) => {
    setFilesToUpload((currentFiles) => [...currentFiles, ...newFiles]);
  };

  const handleUpload = async () => {
    try {
      // Map through the files array and create upload promises
      const uploadPromises = filesToUpload?.map(async (file) => {
        // fIles ref from cloud storage
        const fileRef = ref(storage, `users/${currentUser?.uid}/${file.name}`);

        // Upload the file to Firebase Storage
        await uploadBytes(fileRef, file);
        console.log('Uploaded a file:', file.name);

        // Update the Firestore document to append the file reference
        const fileUploadRef = collection(
          db,
          `users/${currentUser?.uid}/courses/${selectedCourse.id}/files`
        );

        await addDoc(fileUploadRef, {
          fileName: fileRef.name,
          fileReference: fileRef.fullPath,
          uploadedAt: new Date(),
          processed: false,
        });
      });

      // Wait for all upload promises to resolve
      await Promise.all(uploadPromises);

      // Clear the file state after all uploads and updates are complete
      setFilesToUpload([]);
      console.log('All files uploaded and state cleared');
    } catch (error) {
      console.error('Error during file upload or Firestore update:', error);
    }
  };

  return (
    <>
      <Flex direction={'column'}>
        <Dropzone onDrop={handleDrop} w={'350px'}>
          <Text ta="center">Drop your files here</Text>
        </Dropzone>
        {previews}
        <Button
          mt={'30px'}
          px={'10px'}
          color="#26B0DC"
          radius={5}
          maw={'80px'}
          onClick={handleUpload}
        >
          <Text size="17px" fw={600}>
            Upload
          </Text>
        </Button>
      </Flex>
    </>
  );
};

export default CourseContentFileUpload;
