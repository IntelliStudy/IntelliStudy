import { Link } from 'react-router-dom';

const StudySpot = () => {
  return (
    <>
      <h1>Study Spot</h1>
      <div>
        <Link to={'/coursedashboard'}>
          <button>Course Dashboard</button>
        </Link>
      </div>
    </>
  );
};

export default StudySpot;
