import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Form } from 'react-bootstrap';
import del from '../assets/delete.png';
import edit from '../assets/edit.png'
import './components.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const TaskCard = ({ task }) => {
  return (
    <Card className="my-3" style={{ width: '18rem', backgroundColor: '#FFA07A' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Check 
            type="checkbox"
            id={`task-${task.id}`}
            label={<span className="h5">{task.title}</span>}
          />
        </div>
        <Card.Text>
          <small>
            Created: {task.createdAt}<br />
            Deadline: {task.deadline}
          </small>
        </Card.Text>
        <Button className="svltbtn rounded">
            <img src={del} alt="Mark Done" />
        </Button>
        <Button className="svltbtn rounded">
            <img src={edit} alt="Edit" />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;