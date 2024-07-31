import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import UserInfo from './components/UserInfo';
import Accomplished from './pages/Accomplished';
import LTGoals from './pages/LTGoals';
import Todo from './pages/Todo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container-fluid lining"></div>
      <div className="container-fluid header">
        <div className="user">
          <h1 className="title">QuickTo-Do</h1>
          <UserInfo />
        </div>
      </div>
      <Navigation />
      <div className="container">
        <div className="content">
          <Routes>
            <Route path="/" element={<Todo />} />
            <Route path="/ltgoals" element={<LTGoals />} />
            <Route path="/accomplished" element={<Accomplished />} />
          </Routes>
        </div>
        <div className="quote">
          <p>"Quote of the Day"</p>
          <p>dsadsadasdsdasadsadasds</p>
        </div>
      </div>
    </Router>
  );
}

export default App;
