import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <>
      <h1>Profile</h1>
      <div>
        <Link to={'/studyspot'}>
          <button>Back to Study Spot</button>
        </Link>
      </div>
    </>
  );
};

export default Profile;
