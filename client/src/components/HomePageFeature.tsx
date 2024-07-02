import { Flex, Text, Title } from '@mantine/core';

interface HomePageFeatureProps {
  title: string;
  text: string;
}

const HomePageFeature = ({ title, text }: HomePageFeatureProps) => {
  return (
    <>
      <Flex direction={'column'} align={'center'} maw={'50%'}>
        <Title order={3} size={'28px'}>
          {title}
        </Title>
        <Text size="24px" ta={'center'}>
          {text}
        </Text>
      </Flex>
    </>
  );
};

export default HomePageFeature;
