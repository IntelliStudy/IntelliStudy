import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion"; // Import motion for animation
import { useContext, useEffect, useState } from "react";
import { PrevQuizMenu } from "..";
import { UserContext } from "../../App";
import { db } from "../../firebase/firebase";
import { Course, courseFile } from "../../types";
import { FirebaseQuiz } from "../../types/quiz";
import { handleFileDelete } from "../../utilities/fileUploadUtilities";
import "../components.css";
import CourseContentFileUpload from "./CourseContentFileUpload";

interface props {
  selectedCourse: Course;
  modalOpen: () => void;
}

const CourseContent = ({ selectedCourse, modalOpen }: props) => {
  const { currentUser } = useContext(UserContext);
  const [files, setFiles] = useState<courseFile[]>();
  const [quizzes, setQuizzes] = useState<FirebaseQuiz[]>([]);
  const [filesUploading, setFilesUploading] = useState<boolean>();

  // Switches files displayed based on current course
  useEffect(() => {
    const fetchCourseFiles = async () => {
      const fileCollectionRef = collection(
        db,
        `users/${currentUser?.uid}/courses/${selectedCourse.id}/files`
      );

      // Real-time listener for file changes (onSnapshot)
      const unsubscribe = onSnapshot(fileCollectionRef, (snapshot) => {
        const updatedFiles: courseFile[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
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

    const fetchQuizes = async () => {
      const quizzesRef = collection(
        db,
        `users/${currentUser?.uid}/courses/${selectedCourse.id}/quizzes`
      );

      const quizzesSnapshot = await getDocs(quizzesRef);
      const quizDocs = quizzesSnapshot.docs;

      const quizNames: FirebaseQuiz[] = quizDocs.map((quiz) => ({
        quizName: quiz.data().quizName,
        id: quiz.id,
      }));

      setQuizzes(quizNames);
    };

    fetchQuizes();
    fetchCourseFiles();
  }, [currentUser?.uid, selectedCourse]);

  useEffect(() => {
    if (files) {
      // Check if all files are processed
      const allProcessed = files.every((file) => file.processed);
      setFilesUploading(!allProcessed);
    }
  }, [files]);

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
                  <Grid
                    key={index}
                    align="center"
                    py="3px"
                    className="showTrash"
                    style={{ cursor: "default" }}
                  >
                    <Grid.Col span={1}>
                      <Box
                        mr={5}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {!file.processed ? (
                          <Loader size={17} />
                        ) : (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            style={{ fontSize: 50, color: "green" }}
                          >
                            <IconCheck color={"#40bf56"} />
                          </motion.div>
                        )}
                      </Box>
                    </Grid.Col>
                    <Grid.Col span={9}>
                      <Text
                        key={index}
                        style={{
                          flexGrow: 1,
                          flexShrink: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.fileName}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={2} p={0} className="hide">
                      <IconTrash
                        stroke={2}
                        color="red"
                        style={{ marginLeft: 10, cursor: "pointer" }}
                        onClick={() =>
                          handleFileDelete(
                            file,
                            currentUser!.uid,
                            selectedCourse.id
                          )
                        }
                      />
                    </Grid.Col>
                  </Grid>
                );
              })}
          </Flex>
        </Flex>

        <Flex direction={"row"} mt={"200px"} gap="75px">
          <Button
            maw={"220px"}
            px="15px"
            variant="gradient"
            gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
            size="50px"
            radius={10}
            onClick={modalOpen}
            disabled={(files?.length ?? 0) < 1 || filesUploading}
          >
            <Text size="24px" fw={600}>
              Create Quiz
            </Text>
          </Button>
          {quizzes.length > 0 && (
            <PrevQuizMenu
              quizzes={quizzes}
              selectedCourseId={selectedCourse.id}
            />
          )}
        </Flex>
      </Container>
    </>
  );
};

export default CourseContent;
