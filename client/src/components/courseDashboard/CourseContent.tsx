import { Button, Container, Flex, Loader, Text, Title } from "@mantine/core";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { db } from "../../firebase/firebase";
import { Course, courseFile } from "../../types";
import CourseContentFileUpload from "./CourseContentFileUpload";

interface props {
  selectedCourse: Course;
  modalOpen: () => void;
}

const CourseContent = ({ selectedCourse, modalOpen }: props) => {
  const { currentUser } = useContext(UserContext);
  const [files, setFiles] = useState<courseFile[]>();

  // Switches files displayed based on current course
  useEffect(() => {
    const fetchCourseFiles = async () => {
      const fileCollectionRef = collection(
        db,
        `users/${currentUser?.uid}/courses/${selectedCourse.id}/files`
      );

      // const filesSnapshot = await getDocs(fileCollectionRef);

      // // Map Firestore data to `Course` type
      // const files: courseFile[] = filesSnapshot.docs.map((docSnapshot) => {
      //   const data = docSnapshot.data();
      //   return {
      //     fileName: data.fileName,
      //     fileReference: data.fileReference,
      //     processed: data.processed,
      //     uploadedAt: data.uploadedAt,
      //   };
      // });

      // setFiles(files);

      // Real-time listener for file changes (onSnapshot)
      const unsubscribe = onSnapshot(fileCollectionRef, (snapshot) => {
        const updatedFiles: courseFile[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            fileName: data.fileName,
            fileReference: data.fileReference,
            processed: data.processed,
            uploadedAt: data.uploadedAt,
          };
        });

        // Update state with the new files list
        setFiles(updatedFiles);
      });

      // Clean up the listener on component unmount or when dependencies change
      return () => unsubscribe();
    };

    fetchCourseFiles();
  }, [currentUser?.uid, selectedCourse]);

  return (
    <>
      <Container fluid ml={"70px"} mt={"60px"}>
        <Flex direction={"row"} gap={"400px"}>
          <Flex direction={"column"} w={"450px"}>
            <Title order={1} fw={800} fz={"44px"}>
              {selectedCourse.courseCode}
            </Title>
            <Title order={3} fw={500} fz={"30px"}>
              {selectedCourse.courseName}
            </Title>
            <Title order={2} fz={"28px"} fw={500} mt={"75px"} mb={"15px"}>
              Upload
            </Title>

            <CourseContentFileUpload selectedCourse={selectedCourse} />
          </Flex>

          <Flex direction={"column"} mt={"180px"} justify="start">
            <Title order={2} fz={"28px"} fw={500}>
              Files Uploaded
            </Title>
            {files &&
              files.map((file, index) => {
                return (
                  <Flex direction="row" align="center">
                    {!file.processed && <Loader size={17} mr="8px" />}
                    <Text key={index} lineClamp={1}>
                      {file.fileName}
                    </Text>
                  </Flex>
                );
              })}
          </Flex>
        </Flex>

        <Flex direction={"row"} mt={"250px"}>
          <Button
            maw={"250px"}
            variant="gradient"
            gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
            size="xl"
            radius={10}
            onClick={modalOpen}
          >
            <Text size="24px" fw={600}>
              Create Quiz
            </Text>
          </Button>

          <Button
            ml={"100px"}
            maw={"340px"}
            variant="gradient"
            gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
            size="xl"
            radius={10}
          >
            <Text size="24px" fw={600}>
              Create Note Summary
            </Text>
          </Button>
        </Flex>
      </Container>
    </>
  );
};

export default CourseContent;
