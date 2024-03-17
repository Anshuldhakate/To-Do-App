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
    if (!newProject.trim()) {
      alert('Please enter a project name.');
      return;
    }
  
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

  const moveProject = async (projectId, projectName, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/projects/${projectId}`, {
        status: newStatus
      });
      // Update projects locally without fetching from the server
      setProjects(projects.map(project => {
        if (project.id === projectId && project.name === projectName) {
          return { ...project, status: newStatus }; // Retain ID and name, update status
        }
        return project;
      }));
    } catch (error) {
      console.error('Error moving project:', error);
    }
  };

  return (
    <div className="todo-app">
      <h1>TODO APP</h1>
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
          <div>
            {projects
              .filter((project) => project.status === 'todo')
              .map((project) => (
                <div key={project.id} className="project-box">
                  <p>{project.name}</p>
                  <button className='todobtn' onClick={() => moveProject(project.id, project.name, 'in_progress')}>Move to In Progress</button>
                </div>
              ))}
          </div>
        </div>
        <div className="section">
          <h2>In Progress</h2>
          <div>
            {projects
              .filter((project) => project.status === 'in_progress')
              .map((project) => (
                <div key={project.id} className="project-box">
                  <p>{project.name}</p>
                  <button className='progressbtn' onClick={() => moveProject(project.id, project.name, 'review')}>Move to Review</button>
                </div>
              ))}
          </div>
        </div>
        <div className="section">
          <h2>Review</h2>
          <div>
            {projects
              .filter((project) => project.status === 'review')
              .map((project) => (
                <div key={project.id} className="project-box">
                  <p>{project.name}</p>
                  <button className='reviewbtn' onClick={() => moveProject(project.id, project.name, 'done')}>Move to Done</button>
                </div>
              ))}
          </div>
        </div>
        <div className="section">
          <h2>Done</h2>
          <div>
            {projects
              .filter((project) => project.status === 'done')
              .map((project) => (
                <div key={project.id} className="project-box">
                  <p>{project.name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
