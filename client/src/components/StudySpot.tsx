import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

const StudySpot = () => {
  return (
    <>
      <h1>Study Spot</h1>
      <div className="flex flex-row">
        <Link to={'/coursedashboard/8zw287CE1w45RWxbGkwz'}>
          <CourseCard />
        </Link>
        <Link to={'/coursedashboard/9wYdeGpCTakQUUoqM9yk'}>
          <CourseCard />
        </Link>
      </div>
    </>
  );
};

export default StudySpot;
