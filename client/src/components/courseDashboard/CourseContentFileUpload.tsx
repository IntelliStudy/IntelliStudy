import { Button, Flex, Group, rem, Text } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { Notifications, notifications } from "@mantine/notifications";
import { IconTrashFilled, IconX } from "@tabler/icons-react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { db, storage } from "../../firebase/firebase";
import { Course, CourseFile } from "../../types";
import "../components.css";

const errorMessages = {
  "upload/more-than-5-files": {
    title: "Max Number of Files Reached",
    message: "A maximum of 5 files per course is allowed",
  },
  "upload/invalid-file-type": {
    title: "Invalid File Type",
    message: "Please upload a PDF, only PDFs are accepted",
  },
  "upload/invalid-file-size": {
    title: "File Size is too Large",
    message: "Each file must not exceed 5 MB in size",
  },
};

type ErrorCode =
  | "upload/more-than-5-files"
  | "upload/invalid-file-type"
  | "upload/invalid-file-size";

function getErrorMessage(errorCode: ErrorCode) {
  return errorMessages[errorCode];
}

class UploadError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode) {
    super(errorMessages[code].message);
    this.code = code;
    this.name = "UploadError";
  }
}

interface props {
  selectedCourse: Course;
  courseFiles: CourseFile[] | undefined;
}

const CourseContentFileUpload = ({ selectedCourse, courseFiles }: props) => {
  // This state is only used to keep track of files that the user is uplaoding, not all the files they have uploaded in total
  const [filesToUpload, setFilesToUpload] = useState<FileWithPath[]>([]);
  const { currentUser } = useContext(UserContext);

  const previews = filesToUpload?.map((file, index) => {
    return (
      <>
        <Flex direction="row">
          <Group className="showTrash" pr="40px">
            <Text key={index}>{file.name}</Text>
            <IconTrashFilled
              className="hide"
              stroke={2}
              color="red"
              style={{ marginLeft: 10, cursor: "pointer" }}
              onClick={() => {
                const updatedFiles = filesToUpload.filter(
                  (_file, i) => i !== index
                );
                setFilesToUpload(updatedFiles);
              }}
            />
          </Group>
        </Flex>
      </>
    );
  });

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const handleDrop = (newFiles: FileWithPath[]) => {
    setFilesToUpload((currentFiles) => [...currentFiles, ...newFiles]);
  };

  const handleUpload = async () => {
    try {
      if ((courseFiles?.length ?? 0 + filesToUpload.length) >= 5) {
        throw new UploadError("upload/more-than-5-files");
      }

      // Map through the files array and create upload promises
      const uploadPromises = filesToUpload?.map(async (file) => {
        // Validations and checks
        if (file.type !== "application/pdf") {
          throw new UploadError("upload/invalid-file-type");
        }
        if (file.size > 5000000) {
          throw new UploadError("upload/invalid-file-size");
        }

        // fIles ref from cloud storage
        const fileRef = ref(storage, `users/${currentUser?.uid}/${file.name}`);

        // Upload the file to Firebase Storage
        await uploadBytes(fileRef, file);
        console.log("Uploaded a file:", file.name);

        // Update the Firestore document to append the file reference
        const fileUploadRef = collection(
          db,
          `users/${currentUser?.uid}/courses/${selectedCourse.id}/files`
        );

        // Add the file document to Firestore
        const docRef = await addDoc(fileUploadRef, {
          fileName: fileRef.name,
          fileReference: fileRef.fullPath,
          uploadedAt: new Date(),
          processed: false,
        });

        // Update the document with the new id field
        await updateDoc(docRef, { id: docRef.id });
      });

      // Wait for all upload promises to resolve
      await Promise.all(uploadPromises);

      // Clear the file state after all uploads and updates are complete
      setFilesToUpload([]);
      console.log("All files uploaded and state cleared");
    } catch (error) {
      notifications.show({
        icon: xIcon,
        radius: "lg",
        title: getErrorMessage(error.code).title,
        message: getErrorMessage(error.code).message,
        color: "red",
      });
    }
  };

  // Reset files uploaded
  useEffect(() => {
    setFilesToUpload([]);
  }, [selectedCourse]);

  return (
    <>
      <Notifications position="top-right" />

      <Flex direction="column" align="center" gap="md">
        <Dropzone onDrop={handleDrop} w={"1000px"}>
          <Text ta="center">Drop your notes here (PDF only)</Text>
        </Dropzone>
        {previews}
        <Button
          radius="md"
          variant="gradient"
          gradient={{ from: "#2faed7", to: "#0280c7", deg: 180 }}
          w={100}
          p={10}
          onClick={handleUpload}
          disabled={filesToUpload.length === 0}
        >
          Upload
        </Button>
      </Flex>
    </>
  );
};

export default CourseContentFileUpload;
