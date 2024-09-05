import { Flex, Group, Text, Title } from '@mantine/core';

interface props {
  file: string;
  page: string;
}

const AnswerReferenceBox = ({ file, page }: props) => {
  return (
    <Flex
      direction="row"
      w="fit-content"
      maw="100%"
      mt="15px"
      p="5px"
      bg="#EA3A1480"
      style={{ borderColor: 'red', borderWidth: '1.5px', borderRadius: '5px' }}
    >
      <Flex direction="column" px="10px">
        <Title order={4} fz="20px">
          Correct solution:
        </Title>
        <Text>
          Refer back to file{' '}
          <Group display="inline" fw="700">
            {file}
          </Group>{' '}
          on page{' '}
          <Group display="inline" fw="700">
            {page}
          </Group>
        </Text>
      </Flex>
    </Flex>
  );
};

export default AnswerReferenceBox;
