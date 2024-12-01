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
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { AddCourseCard, CourseCard } from "../components";
import { allowedUUIDs } from "../constants";
import { db } from "../firebase/firebase";
import { Course } from "../types";
import logoNoText from "../../logo/logo-no-text.png";

interface UserInfo {
  displayName: string;
  uid: string;
}

const StudySpot = () => {
  const { currentUser } = useContext(UserContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(null);

  const handleAddCourseSubmit = async () => {
    addDoc(collection(db, "users", currentUser!.uid, "courses"), {
      courseName: courseName,
      courseCode: courseCode,
      userId: currentUser!.uid,
      createdAt: serverTimestamp(),
    });
    await fetchData();
    setCourseName("");
    setCourseCode("");
    setModalOpened(false);
  };

  const fetchData = async () => {
    try {
      // Fetch the courses for the current user
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
      console.log("current user", currentUser);
      // Fetch the user's displayName from the users collection
      const userRef = doc(db, "users", currentUser!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData, "userData");

        if (userData?.displayName) {
          setUserInfo({
            displayName: userData.displayName,
            uid: currentUser!.uid, // Only set the displayName and uid
          });
        } else {
          console.error("Display name not found for user", currentUser!.uid);
        }
      } else {
        console.error("User document not found for UID:", currentUser!.uid);
      }

      // Set courses data
      setCourses(courseData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(currentUser?.uid, "current user from use effect");
    if (!currentUser?.uid) return;
    const isUserAllowed = allowedUUIDs.includes(currentUser.uid);
    setIsAllowed(isUserAllowed);

    if (isUserAllowed) {
      fetchData().finally(() => setLoading(false));
    } else {
      setLoading(false); // Stop the loader if access is restricted
    }
  }, [currentUser?.uid]);

  if (loading) {
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
              radius="md"
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
              disabled={!courseName.trim() || !courseCode.trim()}
            >
              Create
            </Button>
          </Center>
        </Stack>
      </Modal>
      <Center pt="25px">
        <img src={logoNoText} width="100px" />
      </Center>
      <Center pt="2%" pb="1%">
        <Text
          size="35px"
          fw={750}
          variant="gradient"
          gradient={{ from: "#2faed7", to: "#0280c7", deg: 180 }}
          pb={10}
        >
          Welcome to your Study Spot, {userInfo?.displayName}.
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
