import {
  Box,
  Button,
  Center,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { AddCourseCard, CourseCard } from "../components";
import { db } from "../firebase/firebase";
import { Course, User } from "../types";
import { allowedUUIDs } from "../constants";
import { Link } from "react-router-dom";

const StudySpot = () => {
  const { currentUser } = useContext(UserContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userInfo, setUserInfo] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  const handleAddCourseSubmit = () => {
    addDoc(collection(db, "users", currentUser!.uid, "courses"), {
      courseName: courseName,
      courseCode: courseCode,
      userId: currentUser!.uid,
      createdAt: serverTimestamp(),
    });
    fetchData();
    setCourseName("");
    setCourseCode("");
    setModalOpened(false);
  };

  const fetchData = async () => {
    try {
      const requestQuery = query(
        collection(db, "users", currentUser!.uid, "courses"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(requestQuery);
      const courseData: Course[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        courseName: doc.data().courseName,
        courseCode: doc.data().courseCode,
        userId: doc.data().userId,
        createdAt: doc.data().createdAt,
      }));

      setCourses(courseData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    setUserInfoLoading(true);
    try {
      const userRef = doc(db, `users/${currentUser?.uid}`);
      const userDoc = (await getDoc(userRef)).data();
      if (userDoc) {
        const userData: User = {
          displayName: userDoc.displayName,
          email: userDoc.email,
          fName: userDoc.fName,
          lName: userDoc.lName,
          password: userDoc.password,
          signedIn: userDoc.signedIn,
          uid: userDoc.uid,
          uploadedFiles: userDoc.uploadedFiles,
        };
        setUserInfo(userData);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setUserInfoLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const isUserAllowed = allowedUUIDs.includes(currentUser.uid);
    setIsAllowed(isUserAllowed);

    if (isUserAllowed) {
      fetchData();
      fetchUserInfo();
    } else {
      setLoading(false); // Stop the loader if access is restricted
    }
  }, [currentUser]);

  if (userInfoLoading || loading) {
    return (
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 20 }}
      />
    );
  }

  if (!isAllowed) {
    return (
      <Box pt="10%" style={{ height: "10vh" }}>
        <Center>
          <img src="../../logo/logo-no-text.png" width="300px" />
        </Center>
        <Center pt="50px">
          <Text size="30px" c="black" fw={700}>
            Hey there, thank you for your interest in IntelliStudy!
          </Text>
        </Center>
        <Center pt="50px">
          <Text size="25px" c="black" fw={500}>
            We're just as excited as you are.
          </Text>
        </Center>
        <Center pt="50px">
          <Text size="20px" c="black" fw={500}>
            IntelliStudy is currently invite-only. Check back soon for our
            public release.
          </Text>
        </Center>

        <Center pt="50px">
          <Link to="/login">
            <Button
              radius="lg"
              size="md"
              variant="gradient"
              gradient={{ from: "#2faed7", to: "#0280c7", deg: 180 }}
            >
              Back to Login
            </Button>
          </Link>
        </Center>
      </Box>
    );
  }

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Title order={4} fw={600}>
            Add Course
          </Title>
        }
        radius="md"
        centered
      >
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter course name"
            value={courseName}
            onChange={(event: {
              currentTarget: { value: SetStateAction<string> };
            }) => setCourseName(event.currentTarget.value)}
            required
          />
          <TextInput
            label="Course Code"
            placeholder="Enter course code"
            value={courseCode}
            onChange={(event: {
              currentTarget: { value: SetStateAction<string> };
            }) => setCourseCode(event.currentTarget.value)}
            required
          />
          <Center>
            <Button
              variant="gradient"
              gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
              radius={15}
              onClick={handleAddCourseSubmit}
            >
              Create
            </Button>
          </Center>
        </Stack>
      </Modal>

      <Center pt="2%" pb="1%">
        <Text
          size="35px"
          fw={750}
          variant="gradient"
          gradient={{ from: "#2faed7", to: "#0280c7", deg: 180 }}
          pb={10}
        >
          {userInfo?.displayName}'s Study Spot
        </Text>
      </Center>
      <Center pb="2%">
        <Text size="18px" fw={600} pb={10}>
          Let the studying begin.
        </Text>
      </Center>

      <Center>
        {courses.length > 0 ? (
          <SimpleGrid cols={4} spacing="lg" verticalSpacing="lg">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                courseId={course.id}
                courseCode={course.courseCode}
                name={course.courseName!}
              />
            ))}
            <AddCourseCard onClick={() => setModalOpened(true)} />
          </SimpleGrid>
        ) : (
          <Stack align="center" gap="5vh">
            <AddCourseCard onClick={() => setModalOpened(true)} />
            <Text c="#808080">
              It looks like you have no courses setup... click the plus icon to
              create one now!
            </Text>
          </Stack>
        )}
      </Center>
    </>
  );
};

export default StudySpot;
