import { Center, Container, Flex, Paper, Text, Title } from "@mantine/core";
import Confetti from "react-confetti";

interface props {
  totalScore: number;
  userScore: number;
}
const QuizScore = ({ totalScore, userScore }: props) => {
  const scorePercentage = (userScore / totalScore) * 100;
  let message = "";
  if (scorePercentage === 100) {
    message = "Perfect score! 🎉 Amazing job!";
  } else if (scorePercentage >= 80) {
    message = "Great work! You're almost there!";
  } else if (scorePercentage >= 50) {
    message = "Good effort! Keep practicing to improve.";
  } else {
    message = "Don't give up! Practice makes perfect. 💪";
  }

  return (
    <Container
      fluid
      w="50%"
      py="45px"
      mt="50px"
      style={{
        background: `linear-gradient(180deg,#2FAED7,#0280C7)`,
        borderRadius: "10px",
        boxShadow: "0px 0px 10px -5px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Confetti tweenDuration={1000} numberOfPieces={100} />
      <Flex direction="column" align="center">
        <Text fw={600} fz="23px" c="white">
          Your score is...
        </Text>
        <Center
          w="11rem"
          h="11rem"
          mt="25px"
          style={{
            background: `white`,
            boxShadow: "0px 0px 15px -6px",
            borderRadius: "100px",
          }}
        >
          <Flex direction="column" align="center">
            <Title order={2} fz="58px" c="black">
              {userScore}
            </Title>
            <Title order={2} fz="22px" fw={500} c="black">
              Out of {totalScore}
            </Title>
          </Flex>
        </Center>
        <Text
          c="white"
          fw={700}
          fz="23px"
          mt="50px"
          style={{ textAlign: "center" }}
        >
          {message}
        </Text>
      </Flex>
    </Container>
  );
};

export default QuizScore;
