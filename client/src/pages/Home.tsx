import {
  Button,
  Container,
  Flex,
  Image,
  LoadingOverlay,
  Text,
  Title,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { placeholder } from '../assets';

import { useContext } from 'react';
import { UserContext } from '../App';
import { HomePageFeature } from '../components';
import { features } from '../constants';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthLoading } = useContext(UserContext);
  if (isAuthLoading)
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
    );

  if (currentUser) {
    navigate('/studyspot');
    return;
  }
  return (
    <>
      <div>
        <Container>
          <Flex direction="column" align="center">
            <Image
              radius="sm"
              mt={'100px'}
              mb={'25px'}
              w={200}
              src="./logo/logo-no-text.png"
              styles={{
                root: {
                  filter: 'drop-shadow(2px 5px 10px rgba(47, 47, 47, 0.20))',
                },
              }}
            />
            <Title order={1} size={60} textWrap="wrap" maw={500} ta={'center'}>
              Your AI-Powered Study Buddy
            </Title>
            <Text size="24px" fw={300} mt={'1rem'} mb={'5rem'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            </Text>
            <Link to="/login">
              <Button
                variant="gradient"
                gradient={{ from: '#2FAED790', to: '#0280C7', deg: 180 }}
                radius={15}
                size="xl"
              >
                <Text size="28px" fw={'bold'}>
                  Try out now
                </Text>
              </Button>
            </Link>
          </Flex>
        </Container>

        <Container fluid mt={'11rem'} px={'6rem'}>
          <Flex direction="row" align="center" justify="center" gap="150px">
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
            {features.map((feature, index) => (
              <HomePageFeature
                key={index}
                title={feature.title}
                text={feature.text}
              />
            ))}
          </Flex>
        </Container>

        <Container fluid mt={'11rem'} px={'6rem'}>
          <Flex direction="row" align="center" justify="center" gap="150px">
            <div>
              <Image src={placeholder} w={'600px'} h={'auto'}></Image>
            </div>

            <div>
              <Text
                size="45px"
                fw={'bold'}
                maw={'650px'}
                lh={'65px'}
                ta={'center'}
                display={'inline-block'}
                variant="gradient"
                gradient={{ from: '#109ECB', to: '#035481' }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore
              </Text>
            </div>
          </Flex>
        </Container>
      </div>
    </>
  );
};

export default Home;
