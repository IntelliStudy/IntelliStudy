import { Button, Menu, rem } from "@mantine/core";
import { IconBook2 } from "@tabler/icons-react";
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
          radius="md"
          size="md"
        >
          Previous Quizzes
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label fz="14px">Quizzes</Menu.Label>
        {quizzes.map((quiz, index) => {
          return (
            <Link
              to={`/course/${selectedCourseId}/quiz/${quiz.id}`}
              key={index}
            >
              <Menu.Item
                key={index}
                fz="16px"
                pr="80px"
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
