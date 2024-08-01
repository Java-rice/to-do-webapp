import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import UserInfo from './components/UserInfo';
import Accomplished from './pages/Accomplished';
import LTGoals from './pages/LTGoals';
import Todo from './pages/Todo';
import { quotes } from './components/quote';
import './App.css';

function App() {
  const date = new Date();
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  const quoteOfTheDay = quotes[dayOfYear % quotes.length];

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
        <div className="quote-container">
          <div className="quote">
            <p className="title qt">Quote of the Day</p>
            <p>"{quoteOfTheDay}"</p>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
