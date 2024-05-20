import { Button, Flex, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { placeholder } from '../assets';

const Home = () => {
  return (
    <>
      <div>
        <section>
          <Flex direction="column" align="center">
            <div>
              <h1>IS</h1>
            </div>
            <h2 className="text-[60px] font-bold text-wrap max-w-[500px] text-center">
              Your AI-Powered Study Buddy
            </h2>
            <p className="text-[24px] font-light mt-4 mb-20">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            </p>
            <Link to="/login">
              <Button
                variant="gradient"
                gradient={{ from: '#2FAED7', to: '#0280C7', deg: 180 }}
                radius={15}
                w="310px"
                h="74px"
              >
                <p className="text-[28px] font-bold">Try out now </p>
              </Button>
            </Link>
          </Flex>
        </section>

        <section className="mt-44 px-24">
          <Flex direction="row" align="center" justify="center" gap="300px">
            <div>
              <p className="text-[45px] font-bold max-w-[500px] leading-[55px] text-center inline-block bg-gradient-to-r from-homepgTestLight to-homepgTestDark text-transparent bg-clip-text">
                A Fun and Engaging way to Study and Learn New Concepts
              </p>
            </div>

            <div>
              <img src={placeholder} className="w-[600px] h-[auto] " />
            </div>
          </Flex>
        </section>

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
