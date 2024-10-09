import { Center, Container, Flex, Paper, Text, Title } from "@mantine/core";
import Confetti from "react-confetti";

interface props {
  totalScore: number;
  userScore: number;
}
const QuizScore = ({ totalScore, userScore }: props) => {
  return (
    <Container
      fluid
      w="50%"
      py="45px"
      mt="50px"
      style={{
        background: "#e8e8e8",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px -5px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Confetti tweenDuration={1000} numberOfPieces={100} />
      <Flex direction="column" align="center">
        <Text fw={600} fz="23px">
          Congratulations! You have scored
        </Text>
        <Center
          w="11rem"
          h="11rem"
          mt="25px"
          style={{
            background: `linear-gradient(280deg, #68D1F2, #26B0DC)`,
            boxShadow: "0px 0px 15px -6px",
            borderRadius: "100px",
          }}
        >
          <Flex direction="column" align="center">
            <Title order={2} fz="58px" c="white">
              {userScore}
            </Title>
            <Title order={2} fz="22px" fw={500} c="white">
              Out of {totalScore}
            </Title>
          </Flex>
        </Center>
        <Text fw={500} fz="15px" mt="50px" style={{ textAlign: "center" }}>
          You did a great job. Learn more by taking <br /> another quiz
        </Text>
      </Flex>
    </Container>
  );
};

export default QuizScore;
