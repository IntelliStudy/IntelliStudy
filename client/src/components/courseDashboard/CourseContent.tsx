import { Button, Container, Flex, Text, Title } from '@mantine/core';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { db } from '../../firebase/firebase';
import { Course, FileRef } from '../../types';
import CourseContentFileUpload from './CourseContentFileUpload';

interface props {
  selectedCourse: Course;
  modalOpen: () => void;
}

const CourseContent = ({ selectedCourse, modalOpen }: props) => {
  const { currentUser } = useContext(UserContext);
  const [files, setFiles] = useState<FileRef[]>(selectedCourse.filesRef);

  // Switches files displayed based on current course
  useEffect(() => {
    setFiles(selectedCourse.filesRef);
  }, [selectedCourse]);

  useEffect(() => {
    const requestQuery = query(
      collection(db, `users/${currentUser!.uid}/courses`)
    );
    console.log(requestQuery);

    const unsubscribe = onSnapshot(
      requestQuery,
      (snapshot: { docChanges: () => any[] }) => {
        snapshot.docChanges().forEach((snapshot) => {
          console.log('data', snapshot.doc.data());

          if (snapshot.doc.data().loading === false) {
            if (snapshot.doc.data().success === false) {
              alert('Error fetching files');
            } else {
              setFiles(snapshot.doc.data().filesRef);
              console.log(snapshot.doc.data().filesRef);
            }
          }
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <>
      <Container fluid ml={'70px'} mt={'60px'}>
        <Flex direction={'row'} gap={'400px'}>
          <Flex direction={'column'} w={'500px'}>
            <Title order={1} fw={800} fz={'44px'}>
              {selectedCourse.courseCode}
            </Title>
            <Title order={3} fw={500} fz={'30px'}>
              {selectedCourse.courseName}
            </Title>
            <Title order={2} fz={'28px'} fw={500} mt={'75px'} mb={'15px'}>
              Upload
            </Title>

            <CourseContentFileUpload selectedCourse={selectedCourse} />
          </Flex>

          <Flex direction={'column'} mt={'180px'}>
            <Title order={2} fz={'28px'} fw={500}>
              Files Uploaded
            </Title>
            {files &&
              files.map((file, index) => {
                return <Text key={index}>{file.fileName}</Text>;
              })}
          </Flex>
        </Flex>

        <Flex direction={'row'} mt={'250px'}>
          <Button
            maw={'250px'}
            variant="gradient"
            gradient={{ from: '#2FAED7', to: '#0280C7', deg: 180 }}
            size="xl"
            radius={10}
            onClick={modalOpen}
          >
            <Text size="24px" fw={600}>
              Create Quiz
            </Text>
          </Button>

          <Button
            ml={'100px'}
            maw={'340px'}
            variant="gradient"
            gradient={{ from: '#2FAED7', to: '#0280C7', deg: 180 }}
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
