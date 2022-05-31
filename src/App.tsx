import { Component, createEffect, createSignal, For, Index } from 'solid-js';
import localForge from "localforage";
import { Todo } from './components/Todo';
import { IToDo, useAppContext } from './context/AppContext';
import { DateTime } from 'luxon';

const App: Component = () => {
  const {state, actions} = useAppContext();
  const [submitting, setSubmitting] = createSignal<boolean>(false);
  const [newTodo, setNewTodo] = createSignal<string>("");

  const handleSubmit = (event: Event) => {
    setSubmitting(true);
    event.preventDefault();

    if (!newTodo()) {
      setSubmitting(false);
      return;
    }

    const insert: IToDo = {
      done: false,
      points: 10,
      content: newTodo()
    }

    setNewTodo("");
    actions.addTodo(insert)
    setSubmitting(false);
  }

  
  const onlyCompleted = (todos: any[]) => todos.filter((t) => t.done);
  const todoTask = (todos: any[]) => todos.sort((a, b) => Number(a.done) - Number(b.done));
  
  return (
    <main class='container px-4 mx-auto space-y-4'>
      <div class=''>
        <h1 class='text-4xl font-bold my-4'>Todo</h1>
        <h4 class='text-2xl font-bold'>{DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</h4>
      </div>
      <div class='flex flex-row space-x-4 font-bold'>
        <div class='p-2 bg-gray-800 rounded'>
          todos count: <span class='text-gray-300'>120</span>
        </div>
        <div class='p-2 bg-gray-800 rounded'>
          completed: <span class='text-green-400'>75% (90)</span>
        </div>
        <div class='p-2 bg-gray-800 rounded'>
          longest strike: <span class='text-green-400'>12 days</span>
        </div>
        <div class='p-2 bg-gray-800 rounded'>
          most productive day: <span class='text-green-400'>Thuesday</span>
        </div>
      </div>
      <div class='mb-4 sm:mb-8 mt-4 bg-[#293241] w-[92vw] sm:relative sm:w-auto'>
        <form autocomplete='off' class='flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 space-x-4' onSubmit={handleSubmit}>
          <div class='flex flex-col w-full sm:w-1/2'>
            <label class='my-3 font-bold' for="todo">What needs to be done today? </label>
            <input
              class='bg-[#f8f9fa] shadow p-2 outline-none text-[#293241] font-bold rounded'
              id="todo"
              value={newTodo()}
              onChange={(e) => setNewTodo(e.currentTarget.value || "")}
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
      <div>
        <h3 class='mb-2 text-xl'>Todo</h3>
        <div class='space-y-3'>
          <For each={todoTask(state.todos)}>
            {(todo, i) => (
              <Todo id={todo.id} done={todo.done} points={todo.points}>{todo.content}</Todo>
            )}
          </For>
        </div>
      </div>
    </main>
  );
};

export default App;
