import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { addDoc, collection, doc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { UserContext } from '../App';



const onGenerate = (uid: string) => {
  const requestsRef = collection(db, 'users',`${uid}`,'requests');
  addDoc(requestsRef,{
    test: true
  });
  
}

const Quiz = () => {

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [quizContent, setQuizContent ] = useState<string>('');


  return (
    <>
      <h1>Quiz</h1>
      <div>
        <Link to={'/studyspot'}>
          <button>Back to Study Spot</button>
        </Link>
        {currentUser && 
        <button onClick={() => onGenerate(currentUser.uid)}>Generate Quiz</button>}
      </div>
    </>
  );
};

export default Quiz;
