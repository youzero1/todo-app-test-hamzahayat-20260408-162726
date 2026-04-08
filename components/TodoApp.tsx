'use client';

import { useState } from 'react';
import styles from './TodoApp.module.css';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const addTask = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    };
    setTasks((prev) => [newTask, ...prev]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Todo List</h1>
          <div className={styles.counter}>
            <span className={styles.counterNumber}>{pendingCount}</span>
            <span className={styles.counterLabel}>
              {pendingCount === 1 ? 'task pending' : 'tasks pending'}
            </span>
          </div>
        </div>

        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask();
            }}
          />
          <button className={styles.addButton} onClick={addTask}>
            Add
          </button>
        </div>

        <div className={styles.filterRow}>
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${
                filter === f ? styles.filterBtnActive : ''
              }`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <ul className={styles.taskList}>
          {filteredTasks.length === 0 && (
            <li className={styles.emptyState}>
              {tasks.length === 0
                ? 'No tasks yet. Add one above!'
                : 'No tasks in this category.'}
            </li>
          )}
          {filteredTasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <button
                className={`${styles.checkbox} ${
                  task.completed ? styles.checkboxChecked : ''
                }`}
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
              >
                {task.completed && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className={`${styles.taskText} ${
                  task.completed ? styles.taskTextCompleted : ''
                }`}
              >
                {task.text}
              </span>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {tasks.some((t) => t.completed) && (
          <div className={styles.footer}>
            <button className={styles.clearBtn} onClick={clearCompleted}>
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
