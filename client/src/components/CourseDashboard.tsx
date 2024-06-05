import { Flex, LoadingOverlay } from '@mantine/core';
import { collection, getDocs } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../App';
import { db } from '../firebase/firebase';
import { Course } from '../types';
import CourseDashboardSidebar from './Sub-Components/CourseDashboardSidebar';
import CoursePage from './Sub-Components/CoursePage';

const CourseDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const { courseId } = useParams();

  const [allCourses, setAllCourse] = useState<Course[]>();
  const [selectedCourse, setSelectedCourse] = useState<Course>();

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
      <Flex direction={'row'}>
        <CourseDashboardSidebar
          courses={allCourses}
          selectedCourseId={selectedCourse.id}
          onSelectCourse={(course) => setSelectedCourse(course)}
        />

        <CoursePage selectedCourse={selectedCourse} />
      </Flex>
    </>
  );
};

export default CourseDashboard;
