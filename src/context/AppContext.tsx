import { createContext, createEffect, onMount, Show, useContext } from "solid-js"
import { createStore } from "solid-js/store";
import localForge from "localforage";

const TODO_STORAGE_KEY = "todos";
const TODO_COUNT_KEY = "index";

export interface IToDo {
    id?: number,
    done: boolean,
    content: string,
    points: number,
    createdAt?: number,
    completedAt?: number
}

interface AppContextState {
    ready: boolean,
    todos: IToDo[]
}

interface IAppContext {
    state: AppContextState
}

const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [state, setState] = createStore({
        todoCount: 0,
        ready: false,
        todos: [],
        completed: []
    })

    onMount(() => {
        localForge.getItem(TODO_STORAGE_KEY).then((data: any[] | null) => {
            if (!data) {
              setState('ready', true);
              return;
            }

            const completed = data.filter((t) => t.done);
            const open = data.filter((t) => !t.done);
            setState('todos', open as any);
            setState('completed', completed as any);
            setState('ready', true);
          }).catch((error) => console.error(error));
    })

    const actions = {
        addTodo: (todo: IToDo) => {
            setState('todoCount', c => c + 1);
            setState('todos', (t) => {
                const createdAt = Date.now();
                const newTodoList = [...t, {...todo, createdAt: createdAt, id: t.length + 1}]
                localForge.setItem(TODO_STORAGE_KEY, newTodoList)
                return newTodoList;
            })
        },
        removeTodo: (id: number) => {
            setState('todos', (t) => {
                const newTodoList = t.filter(t => t.id !== id)
                localForge.setItem(TODO_STORAGE_KEY, newTodoList)
                return newTodoList;
            })
        },
        completed: (id: number) => {
            setState('todos', (t) => {
                const updatedList = t.map(t => {
                    if (t.id === id) {
                        t.done = true;
                    }

                    return t;
                })

                localForge.setItem(TODO_STORAGE_KEY, updatedList)
                return updatedList
            })
        }
    }

    const store = {
        state,
        actions
    }

    return (
        <AppContext.Provider value={store}>
            <Show when={state.ready} fallback={<div>Loading..</div>}>
                {props.children}
            </Show>
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext<any>(AppContext);

