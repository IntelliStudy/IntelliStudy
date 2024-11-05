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
import { ConfirmDelete } from "../ConfirmDelete";
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
      <Container fluid mt={"60px"}>
        <Flex direction="column" align="center" gap="md">
          {/* Course Title */}
          <Title order={1} fw={800} fz={"44px"} ta="center">
            {selectedCourse.courseCode}
          </Title>
          <Title order={3} fw={500} fz={"30px"} ta="center">
            {selectedCourse.courseName}
          </Title>
          {/* File Upload Section */}
          <Box w="100%" mt="xl">
            <Title order={2} fz={"28px"} fw={500} mb="md" ta="center">
              {files?.length > 0
                ? "Upload"
                : "Upload your notes to get started!"}
            </Title>
            <CourseContentFileUpload
              courseFiles={files}
              selectedCourse={selectedCourse}
            />
          </Box>
          {/* Files Uploaded & Actions */}
          <Flex direction="row" align="center" gap="10px" w="100%">
            {/* Uploaded Files List */}
            <Flex direction="column" w="30%">
              {files?.length > 0 ? (
                <Title order={2} fz={"28px"} fw={500}>
                  Files Uploaded
                </Title>
              ) : null}
              {files &&
                files.map((file, index) => (
                  <Grid key={index} py="3px" className="showTrash">
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
                          ConfirmDelete(
                            "Delete File",
                            "Are you sure you want to delete this file? This action cannot be undone.",
                            "Cancel",
                            "Delete File",
                            () =>
                              handleFileDelete(
                                file,
                                currentUser!.uid,
                                selectedCourse.id
                              )
                          )
                        }
                      />
                    </Grid.Col>
                  </Grid>
                ))}
            </Flex>
          </Flex>
          {/* Action Buttons */}
          <Flex direction="row" mt="xl" gap="lg">
            <Button
              variant="gradient"
              gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
              radius="lg"
              size="md"
              onClick={modalOpen}
              disabled={(files?.length ?? 0) < 1 || filesUploading}
            >
              Create Quiz
            </Button>
            {quizzes.length > 0 && (
              <PrevQuizMenu
                quizzes={quizzes}
                selectedCourseId={selectedCourse.id}
              />
            )}
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default CourseContent;
