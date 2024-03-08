import { Route, Routes } from 'react-router-dom';
import './App.css';
import CourseDashboard from './components/CourseDashboard';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Quiz from './components/Quiz';
import StudySpot from './components/StudySpot';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/studyspot" element={<StudySpot />} />
        <Route path="/coursedashboard/:course" element={<CourseDashboard />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </>
  );
}

export default App;
