import React from 'react';
import './pages.css'; // Make sure this CSS file contains the .h-80 class
import TaskCard from '../components/TaskCard';
import add from '../assets/add.png';
import del from '../assets/delete.png';
import done from '../assets/done.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const Accomplished = () => {
  const task = {
    id: 1,
    title: 'Fix Figma Issue',
    createdAt: '7/31/2024 7:55 AM',
    deadline: '8/26/2024 8:00 PM'
  };
  return (
    <div className='h-80'>
      <div className="btn-container">
        <Button className="btn custom-btn orngebtn rounded-pill">
          <img className="img" src={add} alt="Add Task" />
          Add Task
        </Button>
        <Button className="btn custom-btn orngebtn rounded-pill">
          <img className="img" src={del} alt="Mark All Done" />
          Mark All Done
        </Button>
        <Button className="btn custom-btn vltbtn rounded-pill">
          <img className="img" src={done} alt="Clear All" />
          Clear All
        </Button>
      </div>
      <div>
      </div>
    </div>
  );
}

export default Accomplished;