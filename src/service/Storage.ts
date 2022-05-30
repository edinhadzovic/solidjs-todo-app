import localForge from "localforage";
import { DateTime } from "luxon";

export default class Storage {
    readonly todosKey = "todos"
    readonly stateKey = "app_state"
    private today: string = ""
    
    constructor() {
        this.today = DateTime.now().toISODate({format: "basic"});
    }

    initial = () => {
        return new Promise((resolve, reject) => {
            let data = {
                todos: [],
                count: 0
            }

            localForge.getItem(`${this.todosKey}_${this.today}`)
                .then((todos: any[]) => {
                    data.todos = todos || [];
                    return localForge.getItem(this.stateKey);
                }).then((appState: any) => {
                    if (!appState) {
                        resolve(data);
                    }
                    data.count = appState.count || 0
                    resolve(data);
                }).catch(err => reject(err));
        })
    }

    setTodo = (todo: any[]) => {
        return localForge.setItem(`${this.todosKey}_${this.today}`, todo);
    }

    getTodo = (todo: any[]) => {
        return localForge.getItem(`${this.todosKey}_${this.today}`);
    }

    setAppState = (data: any) => {
        return localForge.setItem(this.stateKey, data);
    }

    getAppState = () => localForge.getItem(this.stateKey);
}