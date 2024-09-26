import React, { useEffect, useState } from 'react';
import './css/style.css';  

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [draggingTask, setDraggingTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); 

  useEffect(() => {
    loadTasksFromLocalStorage();
    
    
    const handleFocusIn = (e) => {
      if (e.target.classList.contains('task-input')) {
        const taskDiv = e.target.closest('.task');
        taskDiv.style.backgroundColor = '#00000017';
      }
    };

    const handleFocusOut = (e) => {
      if (e.target.classList.contains('task-input')) {
        const taskDiv = e.target.closest('.task');
        taskDiv.style.backgroundColor = '';
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter' && newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  const addTask = (taskText, isCompleted = false) => {
    const newTask = { taskText, isCompleted };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const saveTasksToLocalStorage = (tasksToSave) => {
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
    loadTasksCount(tasksToSave);
  };

  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      localStorage.setItem('tasks', JSON.stringify([]));
    }
    loadTasksCount(savedTasks ? JSON.parse(savedTasks) : []);
  };

  const loadTasksCount = (tasksToCount) => {
    const itemsLeft = document.getElementById('items-left');
    const count = tasksToCount.filter(task => !task.isCompleted).length;
    itemsLeft.innerHTML = `${count} items left`;
  };

  const clearCompletedTasks = () => {
    const updatedTasks = tasks.filter(task => !task.isCompleted);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleCheckboxChange = (index) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleTaskInputBlur = (index, taskText) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, taskText } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleTaskDragStart = (task) => {
    setDraggingTask(task);
  };

 
  

  const setActiveButton = (filter) => {
    setActiveFilter(filter);
  };

  const handleTaskDragOver = (e, index) => {
    e.preventDefault(); // Required to allow dropping
    const draggingOverTask = document.querySelector(`.task:nth-child(${index + 1})`);
  };
  
  const handleTaskDrop = (index) => {
    if (draggingTask === null) return;
  
    const updatedTasks = [...tasks];
    const draggingTaskIndex = updatedTasks.indexOf(draggingTask);
    
    updatedTasks.splice(draggingTaskIndex, 1);
    updatedTasks.splice(index, 0, draggingTask);
  
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setDraggingTask(null);
  };
  
  const handleTaskDragEnd = (index) => {
    const draggingOverTask = document.querySelector(`.task:nth-child(${index + 1})`);
    setDraggingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'active') return !task.isCompleted;
    if (activeFilter === 'completed') return task.isCompleted;
    return true;
  });

  return (
    <>
    <div className="bacground-section"></div>
    <div className="main-section">
      <div className="header-section">
        <div className="header-todo">Todo</div>
        <div id="toggleDarkMode" className="apirience-icon" onClick={toggleDarkMode}></div>
      </div>
      <div className="create-new-task">
      <label style={{ pointerEvents: "none" }} className="chekbox-t">
        <input type="checkbox" />
        <span className="checkmark" />
      </label>
        <input
          type="text"
          className="task-input-n"
          id="new-task-input"
          placeholder="Create a new task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyUp={handleKeyUp}
        />
      </div>
      <div className="items-section">
        <div id="items" className="items">
          {/* {filteredTasks.map((task, index) => (
            <div className={`task ${task.isCompleted ? 'completed' : ''}`} key={index} draggable onDragStart={() => handleTaskDragStart(task)} onDragEnd={handleTaskDragEnd}>
              <div className="edit-part">
                <label className="chekbox-t">
                  <input type="checkbox" checked={task.isCompleted} onChange={() => handleCheckboxChange(index)} />
                  <span className="checkmark"></span>
                </label>
                <input
                  className="task-input"
                  type="text"
                  value={task.taskText}
                  onChange={(e) => handleTaskInputBlur(index, e.target.value)}
                  onClick={(e) => e.target.removeAttribute('readonly')}
                  onBlur={() => handleTaskInputBlur(index, task.taskText)}
                  onKeyUp={(e) => e.key === 'Enter' && handleTaskInputBlur(index, task.taskText)}
                />
              </div>
              <div className="close-icon" onClick={() => removeTask(index)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
              </div>
            </div>
          ))} */}

{filteredTasks.map((task, index) => (
  <div
    className={`task ${task.isCompleted ? 'completed' : ''}`}
    key={index}
    draggable
    onDragStart={() => handleTaskDragStart(task)}
    onDragOver={(e) => handleTaskDragOver(e, index)}
    onDrop={() => handleTaskDrop(index)}
    onDragEnd={() => handleTaskDragEnd(index)}
  >
    <div className="edit-part">
      <label className="chekbox-t">
        <input type="checkbox" checked={task.isCompleted} onChange={() => handleCheckboxChange(index)} />
        <span className="checkmark"></span>
      </label>
      <input
        className="task-input"
        type="text"
        value={task.taskText}
        onChange={(e) => handleTaskInputBlur(index, e.target.value)}
        onClick={(e) => e.target.removeAttribute('readonly')}
        onBlur={() => handleTaskInputBlur(index, task.taskText)}
        onKeyUp={(e) => e.key === 'Enter' && handleTaskInputBlur(index, task.taskText)}
      />
    </div>
    <div className="close-icon" onClick={() => removeTask(index)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
    </div>
  </div>
))}
        </div>
        <div className="bottom-section">
          <div id="items-left" className="items-left"></div>
          {/* <div className="sort-items">
            <div id="button-all" className="sort-option active" onClick={() => setActiveButton('all')}>All</div>
            <div id="button-active" className="sort-option" onClick={() => setActiveButton('active')}>Active</div>
            <div id="button-completed" className="sort-option" onClick={() => setActiveButton('completed')}>Completed</div>
          </div> */}

<div className="sort-items">
  <div
    id="button-all"
    className={`sort-option ${activeFilter === 'all' ? 'active' : ''}`}
    onClick={() => setActiveButton('all')}
  >
    All
  </div>
  <div
    id="button-active"
    className={`sort-option ${activeFilter === 'active' ? 'active' : ''}`}
    onClick={() => setActiveButton('active')}
  >
    Active
  </div>
  <div
    id="button-completed"
    className={`sort-option ${activeFilter === 'completed' ? 'active' : ''}`}
    onClick={() => setActiveButton('completed')}
  >
    Completed
  </div>
</div>
          <div id="clear-done" className="clear-completed" onClick={clearCompletedTasks}>Clear Completed</div>
        </div>
      </div>
    </div>
  </>
  
  );
};

export default TodoApp;
