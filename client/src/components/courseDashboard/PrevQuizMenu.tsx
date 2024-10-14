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
          maw={"300px"}
          px="15px"
          variant="gradient"
          gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
          size="50px"
          radius={10}
        >
          <Flex direction="row" align="center">
            <Text size="21px" fw={600} mr="10px">
              Previous Quizes
            </Text>
            <IconArrowRightBar stroke={2} size="40px" />
          </Flex>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label fz="14px">Quizes</Menu.Label>
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
