import { useEffect, useState, useTransition } from 'react'
import './App.css'
import {Button, Form, InputGroup} from 'react-bootstrap'
import TaskList from './components/TaskList'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const initialValues = {
  name: '',
  status: false,
  deleted_at: null
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [countTask, setCountTask] = useState(0);
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [theme, setTheme] = useState('light');

  const getTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1/apiTodo/todos");
      const body = await res.json();
      if(res.status === 200) {
        setTasks(body.data);
        setCountTask(body.data.length)
      }
    } catch (error) {
      
    }
  }

  const validateForm = () => {
    const objErrors = {};

    if(!form.name.trim()) objErrors.name = "Field name is required.";

    return objErrors
  }

  const getTasksCompleted = async () => {
    try {
      const res = await fetch("http://127.0.0.1/apiTodo/todos/completed");
      const body = await res.json();
      if(res.status === 200) {
        setTasks(body.data);
        setCountTask(body.data.length);
      }
    } catch (error) {
    }
  }

  const getTasksActive = async () => {
    try {
      const res = await fetch("http://127.0.0.1/apiTodo/todos/active");
      const body = await res.json();
      if(res.status === 200) {
        setTasks(body.data);
        setCountTask(body.data.length);
      }
    } catch (error) {
    }
  }

  const deleteTask = async (task_id) => {
    try {
        const res = await fetch(`http://127.0.0.1/apiTodo/todos/${task_id}`, {
            method: 'DELETE'
        });
        if(res.status === 200 || res.status === 201) {
            getTasks();
        }
    } catch (error) {
    } 
  }

  const handleOnChange = (e) => {
    const {name, value} =  e.target;
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = e => {
    e.preventDefault();

    if(Object.entries(validateForm()).length > 0) {
      setErrors(validateForm());
    } else {
        fetch("http://127.0.0.1/apiTodo/todos", {
          method: 'POST',
          body: JSON.stringify(form)
        }).then(res => res.json())
        .then((data) => {
          if(!data.errors) {
            setForm(initialValues);
            setErrors({});
            getTasks();
          }
        }).catch((e) => {
          alert("Error to submit task")
        })
    }
  }

  const deleteAllCompleteTask = () => {
    const tasksComplete = tasks.filter(task => task.status == 1);

    if(tasksComplete.length > 0) tasksComplete.forEach(task => deleteTask(task.id));
  }
  
  const taskActive = (e, type) =>  {
    let activeLinks = document.querySelectorAll('.cardTaskFilter__item.activeLink');
    
    activeLinks.forEach(link => link.classList.remove('activeLink'));

    e.target.classList.add('activeLink');

    switch(type) {
      case 'all':
        getTasks();
      break;
      case 'active':
        getTasksActive();
      break;
      case 'completed':
        getTasksCompleted();
      break;
    }
  }

  const saveStorage = (key, value) => {
    localStorage.setItem(key, value)
  }

  const changeTheme = () => {
    if(document.body.getAttribute('data-theme') === 'dark') {
      document.body.setAttribute('data-theme', 'light');
      setTheme('light');
      saveStorage('theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      setTheme('dark');
      saveStorage('theme', 'dark');
    }

  }

  const currTheme = () => {
    const theme = localStorage.getItem('theme');
    document.body.setAttribute('data-theme', theme);
    setTheme(theme);
  }

  useEffect(() => {
    currTheme();
    getTasks();
  }, [])

  return (
    <>
      <div className='position-absolute top-0 end-0 mt-4 mx-4 border-0' onClick={changeTheme}>
        {
          theme == "dark"
          ? <button className='border-0 p-2 bg-transparent'><img src="/icon-sun.svg" /></button>
          : <button className='border-0 bg-color-primary p-2 rounded-circle'><img src="/icon-moon.svg" /></button>
        }
      </div>

      <main className='w-100 d-flex align-items-center justify-content-center'>
        <section className='cardTask d-flex flex-column gap-4' style={{width: "320px", height: "auto"}}>
          <article className='cardTask__head bg-card shadow-md rounded shadow-sm px-4 py-3'>
            <Form onSubmit={handleSubmit} id="frmCreateTask" autoComplete='off'>
              <InputGroup className=''>
                <Form.Control name='name' value={form.name} placeholder='Create a new todo...' className="text-color-primary bg-transparent pr-5 shadow-none outline-0 border-0" onChange={handleOnChange} autoFocus />
                {
                  errors.name &&
                  <span className="text-danger py-1 d-block w-100" style={{textAlign: 'left', fontSize: "12px"}}>{errors.name}</span>
                }
              </InputGroup>
            </Form>
          </article>

          <article className='cardTask__body bg-card p-4 shadow-md'>
            <TaskList tasks={tasks} setTasks={setTasks} getTasks={getTasks} deleteTask={deleteTask} theme={theme} />

            <div className='pt-4 d-flex flex-column gap-3'>
              <div className='container'>
                <div className="row">
                  <span className='col-md-2 text-color-primary'>{countTask} items left</span>

                  <ul className='cardTaskFilter text-color-primary d-flex col-md-7 d-flex justify-content-center gap-3' style={{listStyle: "none"}}>
                    <li className='cardTaskFilter__item activeLink' onClick={(e) => taskActive(e, 'all')}>All</li>
                    <li className='cardTaskFilter__item' onClick={(e) => taskActive(e, 'active')}>Active</li>
                    <li className='cardTaskFilter__item' onClick={(e) => taskActive(e, 'completed')}>Completed</li>
                  </ul>

                  <span id='btnDeleteAllCompleteTask' className='col-md-3 text-color-primary' onClick={deleteAllCompleteTask}>Clear Completed</span>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  )
}


export default App
