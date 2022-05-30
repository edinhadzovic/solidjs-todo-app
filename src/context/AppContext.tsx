import { createContext, createEffect, onMount, Show, useContext } from "solid-js"
import { createStore } from "solid-js/store";
import localForge from "localforage";
import Storage from "../service/Storage";

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

const localdb = new Storage();

const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [state, setState] = createStore({
        todoCount: 0,
        ready: false,
        todos: [],
        completed: []
    })

    onMount(() => {
        localdb.initial().then((data: any) => {
            if (!data) {
              setState('ready', true);
              return;
            }

            setState('todoCount', data.count);
            setState('todos', data.todos as any);
            setState('ready', true);
          }).catch((error) => console.error(error));
    })

    const actions = {
        addTodo: (todo: IToDo) => {
            setState('todoCount', c => {
                const count = c + 1;
                localdb.setAppState({
                    count
                })
                return count;
            });
            setState('todos', (t) => {
                const createdAt = Date.now();
                const newTodoList = [{...todo, createdAt: createdAt, id: t.length + 1}, ...t]
                localdb.setTodo(newTodoList)
                return newTodoList;
            })
        },
        removeTodo: (id: number) => {
            setState('todos', (t) => {
                const newTodoList = t.filter(t => t.id !== id)
                localdb.setTodo(newTodoList)
                return newTodoList;
            })
        },
        completed: (id: number) => {
            setState('todos', (t) => {
                const updatedList = t.map(t => {
                    if (t.id === id) {
                        return {...t, done: !t.done}
                    }

                    return t;
                })

                localdb.setTodo(updatedList)
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

