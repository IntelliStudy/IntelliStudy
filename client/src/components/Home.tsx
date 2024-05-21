import { Button, Container, Flex, Image, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { placeholder } from '../assets';

const Home = () => {
  return (
    <>
      <div>
        <Container>
          <Flex direction="column" align="center">
            <Title order={1}>IntelliStudy</Title>
            <Title order={1} size={60} textWrap="wrap" maw={500} ta={'center'}>
              Your AI-Powered Study Buddy
            </Title>
            <Text size="24px" fw={300} mt={'1rem'} mb={'5rem'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            </Text>
            <Link to="/login">
              <Button
                variant="gradient"
                gradient={{ from: '#2FAED7', to: '#0280C7', deg: 180 }}
                radius={15}
                w="310px"
                h="74px"
              >
                <Text size="28px" fw={'bold'}>
                  Try out now
                </Text>
              </Button>
            </Link>
          </Flex>
        </Container>

        <Container fluid mt={'11rem'} px={'6rem'}>
          <Flex direction="row" align="center" justify="center" gap="300px">
            <div>
              <Text
                size="45px"
                fw={'bold'}
                maw={500}
                lh={'65px'}
                ta={'center'}
                display={'inline-block'}
                variant="gradient"
                gradient={{ from: '#109ECB', to: '#035481' }}
              >
                A Fun and Engaging way to Study and Learn New Concepts
              </Text>
            </div>

            <div>
              <Image src={placeholder} w={'600px'} h={'auto'}></Image>
            </div>
          </Flex>
        </Container>

        <Container fluid mt={'11rem'} px={'6rem'}>
          <Flex
            direction={'row'}
            align={'center'}
            justify={'center'}
            gap={'100px'}
          >
            <Flex direction={'column'} align={'center'} maw={'50%'}>
              <Title order={3} size={'28px'}>
                Feature 1
              </Title>
              <Text size="24px" ta={'center'}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </Flex>
            <Flex direction={'column'} align={'center'} maw={'50%'}>
              <Title order={3} size={'28px'}>
                Feature 2
              </Title>
              <Text size="24px" ta={'center'}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </Flex>
            <Flex direction={'column'} align={'center'} maw={'50%'}>
              <Title order={3} size={'28px'}>
                Feature 3
              </Title>
              <Text size="24px" ta={'center'}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </Flex>
          </Flex>
        </Container>

        <div>
          <Link to="/login">
            <button>Try the Quiz Maker</button>
          </Link>
        </div>
        <div>
          <Link to="/login">
            <button>Try the Note Summarizer</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
