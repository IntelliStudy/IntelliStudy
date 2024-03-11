import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';

const Home = () => {
  const setValue = (): void => {
    const docRef = doc(db, 'frontendTest', 'eMoZsDt0CZ81ow5M59wf');
    setDoc(docRef, { generate: false });
  };

  return (
    <>
      <h1>IntelliStudy</h1>
      <h2>Your AI powered Study Buddy</h2>
      <div className="card">
        <button onClick={setValue}>Click me test</button>
      </div>
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
    </>
  );
};

export default Home;
