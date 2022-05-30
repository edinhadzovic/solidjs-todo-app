import { Icon } from "solid-heroicons";
import { checkCircle, minusCircle, trash } from "solid-heroicons/solid";
import { Component } from "solid-js";
import { useAppContext } from "../context/AppContext";

interface ITodoProps {
    id: number
    done: boolean
    points: number
    children: any
}

export const Todo: Component<ITodoProps> = ({done, id, children}) => {
    const {actions} = useAppContext();
    const classState = done ? "bg-[#00f5d4] hover:bg-[#02D0B4]" : "bg-[#252E3C] hover:bg-[#252D3A]"
    
    return (
        <div class={`rounded flex px-4 py-4 w-full items-center ${classState} hover:cursor-pointer transition-all`}>
            <div class="flex space-x-4">
                <div>
                    {/* <input type="checkbox" checked={done} /> */}
                    {done ? <Icon class="w-5 h-5" path={checkCircle} /> : <Icon class="w-5 h-5" path={minusCircle} />}
                    {/* <Checkbox /> */}
                </div>
                <div class="break-all font-bold">
                    {children}
                </div>
            </div>
            <div class="flex flex-row space-x-4 items-center ml-auto">
                {!done &&
                    <>
                        <button disabled={done} onClick={() => actions.completed(id)} class="w-5 h-5 group-disabled">
                            <Icon class="text-[#00f5d4] group-disabled:text-gray-100" path={checkCircle}/>
                        </button>
                        <button onClick={() => actions.removeTodo(id)} class="w-5 h-5">
                            <Icon class="text-red-500" path={trash}/>
                        </button>
                    </>
                }
                
            </div>
        </div>
    );
}