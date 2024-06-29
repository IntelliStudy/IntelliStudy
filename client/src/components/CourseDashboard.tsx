import { Divider, Flex, LoadingOverlay, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../App';
import { db } from '../firebase/firebase';
import { Course } from '../types';
import CourseDashboardSidebar from './Sub-Components/CourseDashboardSidebar';
import CoursePage from './Sub-Components/CoursePage';
import CreateQuizModal from './Sub-Components/CreateQuizModal';

const CourseDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const { courseId } = useParams();

  // Courses state variables
  const [allCourses, setAllCourse] = useState<Course[]>();
  const [selectedCourse, setSelectedCourse] = useState<Course>();

  // Modal State
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchAllCourses = async () => {
      const coursesCollectionRef = collection(
        db,
        `users/${currentUser?.uid}/courses/`
      );

      const allCoursesSnapshot = await getDocs(coursesCollectionRef);

      // Map Firestore data to `Course` type
      const coursesData: Course[] = allCoursesSnapshot.docs.map(
        (docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            courseCode: data.courseCode,
            courseName: data.courseName,
            filesRef: data.filesRef,
            userId: data.userId,
            createdAt: data.createdAt,
          };
        }
      );

      setAllCourse(coursesData);
    };

    fetchAllCourses();
  }, [currentUser]);

  useEffect(() => {
    // Find and set the selected course from the fetched courses
    if (allCourses && allCourses.length > 0) {
      const foundCourse = allCourses.find((course) => course.id === courseId);
      if (foundCourse) {
        setSelectedCourse(foundCourse);
      }
    }
  }, [allCourses, courseId]);

  if (!allCourses || !selectedCourse) {
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
    );
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size={'xl'}
        centered
        withCloseButton={false}
      >
        <Modal.Header pb={'5px'}>
          <Modal.Title>
            <Title order={2} fw={700}>
              Create Quiz
            </Title>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <CreateQuizModal />
      </Modal>
      <Flex direction={'row'}>
        <CourseDashboardSidebar
          courses={allCourses}
          selectedCourseId={selectedCourse.id}
          onSelectCourse={(course) => setSelectedCourse(course)}
        />

        <CoursePage selectedCourse={selectedCourse} modalOpen={open} />
      </Flex>
    </>
  );
};

export default CourseDashboard;
