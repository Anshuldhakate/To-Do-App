import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './todo.css'; // Import CSS file

function TodoApp() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('todo'); // Default status is 'todo'

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const addProject = async () => {
    try {
      const response = await axios.post('http://localhost:3001/projects', {
        name: newProject,
        status: newProjectStatus
      });
      setProjects([...projects, response.data]);
      setNewProject('');    
      setNewProjectStatus('todo');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div className="add-project">
        <input
          type="text"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          placeholder="Enter project name"
        />
        <select value={newProjectStatus} onChange={(e) => setNewProjectStatus(e.target.value)}>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        <button onClick={addProject}>Add Project</button>
      </div>
      <div className="sections">
        <div className="section">
          <h2>Todo</h2>
          <ul>
            {projects.filter(project => project.status === 'todo').map((project) => (
              <li key={project.id} className="project-box">{project.name}</li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>In Progress</h2>
          <ul>
            {projects.filter(project => project.status === 'in_progress').map((project) => (
              <li key={project.id} className="project-box">{project.name}</li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>Review</h2>
          <ul>
            {projects.filter(project => project.status === 'review').map((project) => (
              <li key={project.id} className="project-box">{project.name}</li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>Done</h2>
          <ul>
            {projects.filter(project => project.status === 'done').map((project) => (
              <li key={project.id} className="project-box">{project.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
