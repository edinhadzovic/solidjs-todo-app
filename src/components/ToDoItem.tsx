import { Component } from "solid-js";

interface IToDoItemsProps {
    done: boolean
    points: number
    children: any
}

export const ToDoItem: Component<IToDoItemsProps> = ({done, points, children}) => {
    return (
        <div class="flex px-4 py-2 bg-gray-100 shadow w-full items-center">
            <div class="flex space-x-4">
                <div>
                    <input type="checkbox" checked={done} />
                </div>
                <div>
                    {children}
                </div>
            </div>
            <div class="flex flex-col items-center ml-auto">
                <div class="text-2xl font-bold">{points}</div>
                <div>Points</div>
            </div>
        </div>
    );
}