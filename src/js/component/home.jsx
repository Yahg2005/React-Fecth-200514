import React, { useEffect, useState } from 'react';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

  // Obtener las tareas de la API al cargar el componente
  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/users/yahg2005', {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setTodos(data.todos);
    })
    .catch(error => {
      console.error('Error al cargar las tareas:', error);
    });
  }, []);

   // Función para actualizar una tarea específica en el servidor
   const updateTaskOnServer = (task) => {
    console.log("Actualizando tarea en el servidor:", task);
    
    fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: task.label,
        is_done: task.is_done
      }) // Enviar una tarea específica

    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      console.log("Tarea actualizada con éxito en el servidor:", result);
    })
    .catch(error => {
      console.error('Error actualizando la tarea:', error);
    });
  };

  // Función para agregar una nueva tarea
  const addTask = () => {
    const newTask = {
      label: inputValue,
      is_done: false
    };
    fetch('https://playground.4geeks.com/todo/todos/yahg2005', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const updatedTasks = [...todos, data]; 
      setTodos(updatedTasks); 
      setInputValue(''); 
    })
    .catch(error => {
      console.error('Error agregando la tarea:', error);
    });
  };

  // Función para eliminar una tarea
  const deleteTask = (id) => {
   console.log("ID de la tarea a eliminar:", id);
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }})
    
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
        console.log("se ejecuto bien")
        console.log("Estado de 'todos'antes de actualizar:",todos);
    const updatedTasks = todos.filter((task) => task.id !== id);
      setTodos(updatedTasks);
      console.log("Estados de 'todos' despues de actualizar:",updatedTasks);
    })
    .catch(error => {
      console.error('Error al eliminar las tareas:', error);
    });
  };
  // Función para limpiar todas las tareas
  const clearTasksOnServer = () => {
    const deletePromises = todos.map(task =>
      fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json().catch(() => ({}));
      })
    );

    Promise.all(deletePromises)
      .then(() => {
        console.log("Todas las tareas eliminadas con éxito en el servidor");
        setTodos([]); // Actualizar el estado local para reflejar la lista vacía
      })
      .catch(error => {
        console.error('Error eliminando las tareas:', error);
      });
  };

  const clearTasks = () => {
    clearTasksOnServer();
    }

    const handleKeyDown = (e) => {
      console.log('Tecla presionada:', e.key);
      if (e.key === "Enter") {
        console.log('Enter presionado, añadiendo tarea');
        addTask();
      }
    }
  
  return (
    <div>
      <h1>TODOList</h1>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        onKeyDown={handleKeyDown}
        placeholder="Agregar tarea"
      />
      <button onClick={addTask}>Agregar tarea</button>
      <ul>
        {todos.map((task, index) => (
          <li key={index}>
            {task.label}
            <button onClick={() => deleteTask(task.id)}>Borrar</button>
          </li>
        ))}
      </ul>
      <button onClick={clearTasks}>Limpiar Todas Las Tareas</button>
    </div>
  );
};

export default Home;
