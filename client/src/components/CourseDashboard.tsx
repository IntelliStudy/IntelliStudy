import { Link } from 'react-router-dom';

const CourseDashboard = () => {
  return (
    <>
      <h1>Course Dashboard</h1>
      <div>
        <Link to={'/quiz'}>
          <button>Quiz</button>
        </Link>
      </div>
    </>
  );
};

export default CourseDashboard;
