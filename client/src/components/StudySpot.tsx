import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

const StudySpot = () => {
  return (
    <>
      <h1>Study Spot</h1>
      <div className="flex flex-row">
        <Link to={'/coursedashboard/1'}>
          <CourseCard />
        </Link>
        <Link to={'/coursedashboard/2'}>
          <CourseCard />
        </Link>
        <Link to={'/coursedashboard/3'}>
          <CourseCard />
        </Link>
      </div>
    </>
  );
};

export default StudySpot;
