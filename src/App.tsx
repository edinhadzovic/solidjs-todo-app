import { Component, createEffect, createSignal, For } from 'solid-js';
import localForge from "localforage";
import { ToDoItem } from './components/ToDoItem';

interface IToDo {
  done: boolean,
  content: string,
  points: number,
  createdAt?: Date,
  completedAt?: Date
}

const App: Component = () => {
  const [submitting, setSubmitting] = createSignal<boolean>(false);
  const [newTodo, setNewTodo] = createSignal<string>("");
  const [todo, addTodo] = createSignal<IToDo[]>([]);

  createEffect(() => {
    localForge.getItem("todo").then((data) => {
      if (!data) {
        return;
      }
      addTodo(data as IToDo[]);
    }).catch((error) => console.error(error));
  })


  const handleSubmit = (event: Event) => {
    setSubmitting(true);
    event.preventDefault();
    const insert: IToDo = {
      done: false,
      points: 10,
      content: newTodo()
    }
    setNewTodo("");
    addTodo((todos) => [...todos, insert])
    localForge.setItem("todo", todo()).then(() => {
      setSubmitting(false);
    }).catch((error) => {
      setSubmitting(false);
      console.error(error)
    });
  }

  return (
    <main class='container px-4 mx-auto'>
      <div>
        <h1 class='text-4xl font-bold my-4 text-center'>Your great todo list</h1>
      </div>
      <div class='mb-4 sm:mb-8 mt-4 fixed bottom-0 bg-[#293241] w-[92vw] sm:relative sm:w-auto'>
        <form class='flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 space-x-4' onSubmit={handleSubmit}>
          <div class='flex flex-col w-full sm:w-1/2'>
            <label class='my-3 font-bold' for="todo">What needs to be done? </label>
            <input
              class='bg-[#e0fbfc] shadow p-2 outline-none text-[#293241] font-bold'
              id="todo"
              value={newTodo()}
              onChange={(e) => setNewTodo(e.currentTarget.value)}
            />
          </div>
          <div class='w-full'>
            <button
              disabled={submitting()}
              class='w-full sm:w-auto bg-[#ee6c4d] disabled:bg-gray-400 disabled:text-black px-4 py-2 text-gray-50 font-bold transition-all rounded' 
              type='submit'
            >Add ToDo</button>
          </div>
        </form>
      </div>
      <div class='space-y-3'>
        <For each={todo()}>
          {(todo, i) => (
            <ToDoItem done={todo.done} points={todo.points}>{todo.content}</ToDoItem>
          )}
        </For>
      </div>
      
    </main>
  );
};

export default App;
