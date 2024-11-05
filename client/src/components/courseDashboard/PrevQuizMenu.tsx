import { Button, Flex, Menu, rem, Text } from "@mantine/core";
import { IconArrowRightBar, IconBook2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { FirebaseQuiz } from "../../types/quiz";

interface props {
  quizzes: FirebaseQuiz[];
  selectedCourseId: string;
}

const PrevQuizMenu = ({ quizzes, selectedCourseId }: props) => {
  return (
    <Menu position="top">
      <Menu.Target>
        <Button
          variant="gradient"
          gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
          radius="lg"
          size="md"
        >
          Previous Quizzes
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label fz="14px">Quizzes</Menu.Label>
        {quizzes.map((quiz, index) => {
          return (
            <Link to={`/course/${selectedCourseId}/quiz/${quiz.id}`}>
              <Menu.Item
                key={index}
                fz="16px"
                leftSection={
                  <IconBook2 style={{ width: rem(20), height: rem(20) }} />
                }
              >
                {quiz.quizName}
              </Menu.Item>
            </Link>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default PrevQuizMenu;
