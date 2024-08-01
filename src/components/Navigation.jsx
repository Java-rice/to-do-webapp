import React from "react";
import { NavLink } from "react-router-dom";
import './components.css';

const Navigation = () => {
  return (
    <div>
      <ul className="nav nav-pills">
        <li className="nav-item">
          <NavLink className="nav-link" to="/" end>
            To Do List
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/ltgoals">
            Long Term Goals
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/accomplished">
            Accomplished
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
