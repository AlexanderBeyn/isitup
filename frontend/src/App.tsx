import { FunctionComponent, Reducer, useEffect, useReducer } from "react";
import { AddDestination, RemoveDestination } from "../wailsjs/go/main/App";
import { pinger } from "../wailsjs/go/models";
import { EventsOff, EventsOn } from "../wailsjs/runtime/runtime";
import { Input } from "./components/Input";
import { PingLine } from "./components/PingLine";

const reducer: Reducer<Record<string, pinger.PingEvent>, pinger.PingEvent> = (prevState, action) => {
    const newState = { ...prevState };

    if (action.destroy) {
        delete newState[action.destination];
        return newState;
    }

    newState[action.destination] = action;

    return newState;
};

interface Props {}

export const App: FunctionComponent<Props> = ({}) => {
    const [data, dispatch] = useReducer(reducer, {});

    const tmp = (p: any) => {
        console.log(p);
        dispatch(p);
    };

    useEffect(() => {
        EventsOn("ping", tmp);
        return () => EventsOff("ping");
    }, []);

    const add = (destination: string) => {
        if (!destination) return;

        dispatch(new pinger.PingEvent({ destination, error: { message: "..." } }));
        AddDestination(destination);
    };

    return (
        <div className="flex flex-col gap-2 p-2 break-all cursor-default">
            <Input placeholder="Add destination..." submitLabel="Add" onSubmit={add} />
            {Object.values(data).map(p => (
                <div className="flex flex-row flex-wrap items-center gap-2 group">
                    <div className="max-w-full grow">
                        <PingLine p={p} />
                    </div>
                    <button
                        className="absolute right-0 invisible px-2 font-bold text-white bg-red-300 hover:bg-red-500 group-hover:visible"
                        onClick={() => RemoveDestination(p.destination)}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};
