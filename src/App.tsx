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
    <main class='container mx-auto'>
      <div class='space-y-3'>
        <For each={todo()}>
          {(todo, i) => (
            <ToDoItem done={todo.done} points={todo.points}>{todo.content}</ToDoItem>
          )}
        </For>
      </div>
      <div class='mt-8 border-t-2 border-gray-100'>
        <form class='flex flex-col' onSubmit={handleSubmit}>
          <div class='flex flex-col'>
            <label class='my-3 font-bold' for="todo">What needs to be done? </label>
            <textarea
              rows={4}
              class='bg-gray-50 shadow p-2 outline-none'
              id="todo"
              value={newTodo()}
              onChange={(e) => setNewTodo(e.currentTarget.value)}
            />
          </div>
          <div class='ml-auto mt-8'>
            <button
              disabled={submitting()}
              class='bg-green-600 hover:bg-green-500 disabled:bg-gray-400 disabled:text-black px-8 py-4 text-gray-50 font-bold border-2 border-green-200 transition-all rounded' 
              type='submit'
            >Add ToDo</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default App;
