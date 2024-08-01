import React, { useState } from "react";
import "./pages.css"; // Ensure this is after the Bootstrap import
import TaskCard from "../components/TaskCard";
import add from "../assets/add.png";
import del from "../assets/delete.png";
import done from "../assets/done.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const Todo = () => {
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [isLongTerm, setIsLongTerm] = useState(false);
  const [longTermGoal, setLongTermGoal] = useState("");
  const [task, setTask] = useState({
    id: 1,
    title: "Fix Figma Issue",
    createdAt: "7/31/2024 7:55 AM",
    deadline: "8/26/2024 8:00 PM",
    isLongTerm: false,
    longTermGoal: "",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSaveTask = () => {
    setTask({
      ...task,
      title: taskTitle,
      deadline: format(taskDeadline, "M/d/yyyy h:mm a"), // Format the deadline
      isLongTerm,
      longTermGoal,
    });
    handleClose();
  };

  return (
    <div className="h-80">
      <div className="btn-container">
        <Button
          className="btn custom-btn orngebtn rounded-pill"
          onClick={handleShow}
        >
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
        <TaskCard task={task} />
      </div>

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#F8FFFE" }}>
          <Form>
            <Form.Group controlId="taskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="taskDeadline">
              <Form.Label>Deadline</Form.Label>
              <DatePicker
                selected={taskDeadline}
                onChange={(date) => setTaskDeadline(date)}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
              />
            </Form.Group>
            <Form.Group controlId="isLongTerm">
              <Form.Check
                type="checkbox"
                label="Is this a long-term goal?"
                checked={isLongTerm}
                onChange={(e) => setIsLongTerm(e.target.checked)}
              />
            </Form.Group>
            {isLongTerm && (
              <Form.Group controlId="longTermGoal">
                <Form.Label>Long-Term Goal</Form.Label>
                <Form.Control
                  as="select"
                  value={longTermGoal}
                  onChange={(e) => setLongTermGoal(e.target.value)}
                >
                  <option value="">Select a goal</option>
                  <option value="Career Development">Career Development</option>
                  <option value="Health and Fitness">Health and Fitness</option>
                  <option value="Personal Growth">Personal Growth</option>
                  <option value="Financial Stability">
                    Financial Stability
                  </option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
            )}
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
            Save Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Todo;
