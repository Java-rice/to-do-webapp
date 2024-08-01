import React, { useState, useEffect } from 'react';
import './pages.css';
import LTTaskCard from '../components/LTTaskCard';
import add from '../assets/add.png';
import del from '../assets/delete.png';
import done from '../assets/done.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import axios from 'axios';

const LTGoals = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/goals");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  
  const handleShowConfirm = () => setShowConfirmModal(true);
  const handleCloseConfirm = () => setShowConfirmModal(false);

  const handleSaveTask = async () => {
    try {
      const newTask = {
        title: taskTitle,
        deadline: format(taskDeadline, "M/d/yyyy h:mm a"),
        type: 'goal'
      };
      const response = await axios.post("http://localhost:5000/goals", newTask);
      if (response.status === 201) {
        setTasks([...tasks, response.data]);
        handleClose();
      } else {
        console.error("Failed to create task:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleClearAllTasks = async () => {
    try {
      const response = await axios.delete("http://localhost:5000/goals");
      if (response.status === 200) {
        setTasks([]);
        handleCloseConfirm();
      } else {
        console.error("Failed to clear tasks:", response.statusText);
      }
    } catch (error) {
      console.error("Error clearing tasks:", error);
    }
  };

  return (
    <div className='h-80'>
      <div className="btn-container">
        <Button
          className="btn custom-btn orngebtn rounded-pill"
          onClick={handleShow}
        >
          <img className="img" src={add} alt="Add Task" />
          Add Long Term Goal
        </Button>
        <Button className="btn custom-btn orngebtn rounded-pill">
          <img className="img" src={del} alt="Mark All Done" />
          Mark All Done
        </Button>
        <Button
          className="btn custom-btn vltbtn rounded-pill"
          onClick={handleShowConfirm}
        >
          <img className="img" src={done} alt="Clear All" />
          Clear All
        </Button>
      </div>
      <div className="task-container">
        {tasks.map(task => (
          <LTTaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Long Term Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#F8FFFE"}}>
          <Form>
            <Form.Group controlId="taskTitle">
              <Form.Label>Goal Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter goal title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="taskDeadline">
              <Form.Label>Goal Date</Form.Label>
              <DatePicker
                selected={taskDeadline}
                onChange={(date) => setTaskDeadline(date)}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#FF7F4D" }}>
          <Button
            variant="outline-light"
            size="sm"
            onClick={handleClose}
            style={{
              borderColor: "#5E1B89",
              color: "#5E1B89",
              marginRight: "10px",
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveTask}
            style={{
              backgroundColor: "#5E1B89",
              borderColor: "#5E1B89",
              color: "white",
            }}
          >
            Save Goal
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Clear All Modal */}
      <Modal show={showConfirmModal} onHide={handleCloseConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Clear All</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to clear all tasks? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleCloseConfirm}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleClearAllTasks}
          >
            Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LTGoals;
