import { Flex, Group, Text, Title } from "@mantine/core";

interface props {
  file: string;
  page: string;
  correctAnswer?: string;
}

const AnswerReferenceBox = ({ file, page, correctAnswer }: props) => {
  return (
    <Flex
      direction="row"
      w="fit-content"
      maw="70%"
      mt="15px"
      p="5px"
      bg="#EA3A1460"
      style={{ borderColor: "red", borderWidth: "1.5px", borderRadius: "5px" }}
    >
      <Flex direction="column" px="10px">
        <Title order={4} fz="20px">
          Correct solution:
        </Title>
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
