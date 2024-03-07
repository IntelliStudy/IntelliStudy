import { Link } from 'react-router-dom';

const Quiz = () => {
  return (
    <>
      <h1>Quiz</h1>
      <div>
        <Link to={'/studyspot'}>
          <button>Back to Study Spot</button>
        </Link>
      </div>
    </>
  );
};

export default Quiz;
