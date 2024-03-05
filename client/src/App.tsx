import { doc, setDoc } from 'firebase/firestore';
import './App.css';
import LoginForm from './components/LoginForm';
import { db } from './firebase/firebase';

function App() {
  const setValue = (): void => {
    const docRef = doc(db, 'frontendTest', 'eMoZsDt0CZ81ow5M59wf');
    setDoc(docRef, { generate: false });
  };

  return (
    <>
      <h1>IntelliStudy</h1>
      <div className="card">
        <button onClick={setValue}>Click me test</button>
        <LoginForm />
      </div>
    </>
  );
}

export default App;
