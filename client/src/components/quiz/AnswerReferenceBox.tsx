import { Flex, Group, Text, Title } from "@mantine/core";

interface props {
  file: string;
  page: string;
  correctAnswer?: string;
  type?: boolean;
}

const AnswerReferenceBox = ({ file, page, correctAnswer, type }: props) => {
  return (
    <Flex
      direction="row"
      maw="100%"
      mt="15px"
      p="5px"
      bg="#ADD8E6"
      style={{
        borderRadius: "5px",
        borderWidth: "1.5px",
      }}
    >
      <Flex direction="column" px="10px">
        {type ? (
          <Title order={4} fz="20px">
            Sample correct solution:
          </Title>
        ) : (
          <Title order={4} fz="20px">
            Correct solution:
          </Title>
        )}
        <Text>
          Refer back to file{" "}
          <Group display="inline" fw="700">
            {file}
          </Group>{" "}
          on page{" "}
          <Group display="inline" fw="700">
            {page}
          </Group>
        </Text>
        <Text mt="15px" fz="14px" fs="italic">
          {correctAnswer}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AnswerReferenceBox;
