import {
  Button,
  Container,
  Group,
  Image,
  List,
  LoadingOverlay,
  rem,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

import { IconCheck } from "@tabler/icons-react";
import { useContext } from "react";
import { UserContext } from "../App";
import classes from "./HeroTitle.module.css";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthLoading } = useContext(UserContext);
  if (isAuthLoading)
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
    );

  if (currentUser) {
    navigate("/studyspot");
    return;
  }
  return (
    <>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Text
              size="100px"
              fw={750}
              variant="gradient"
              gradient={{ from: "#2faed7", to: "#0280c7", deg: 180 }}
              pb={10}
            >
              IntelliStudy
            </Text>
            <Title className={classes.title}>
              The smart study-buddy you've
              <span className={classes.highlight}>always</span>
              wanted.
            </Title>
            <Text c="black" mt="md">
              What if your notes could teach you? Turn your study notes into
              fun, interactive quizzes with IntelliStudy. Make studying a breeze
              and learning more engaging.
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl" color="#2faed7">
                  <IconCheck
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>AI-Powered Platform for Efficient Studying</b> – IntelliStudy
                makes studying more efficient and effective with AI-driven
                tools.
              </List.Item>
              <List.Item>
                <b>Custom Quiz Formats</b> – Create quizzes in custom formats
                for a more tailored studying experience.
              </List.Item>
              <List.Item>
                <b>Efficient Grading</b> – IntelliStudy provides fast and
                accurate grading, even for those long written questions.
              </List.Item>
              <List.Item>
                <b>Detailed Feedback</b> – Get specific feedback on each
                question, complete with references to your notes.
              </List.Item>
            </List>

            <Group mt={60}>
              <Link to="/login">
                <Button
                  radius="md"
                  size="md"
                  variant="gradient"
                  gradient={{ from: "#2faed7", to: "#0280c7", deg: 180 }}
                >
                  Get started
                </Button>
              </Link>
            </Group>
          </div>
          <Image src="../logo/logo-no-text.png" h={300} pl={100} pt={100} />
        </div>
      </Container>
    </>
  );
};

export default Home;
