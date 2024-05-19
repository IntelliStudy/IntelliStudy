import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="flex justify-center mt-16">
        <div>
          <h1>IntelliStudy</h1>
          <h2>Your AI powered Study Buddy</h2>
          <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
            Indigo cyan
          </Button>

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
      </div>
    </>
  );
};

export default Home;
