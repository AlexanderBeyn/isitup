import { FunctionComponent, useRef } from "react";

interface Props {
    placeholder?: string;
    submitLabel?: string;
    onSubmit: (value: string) => void;
}

export const Input: FunctionComponent<Props> = ({ placeholder, submitLabel = "&crarr;", onSubmit }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const doSubmit = () => {
        if (!inputRef.current) return;

        onSubmit(inputRef.current.value);
        inputRef.current.value = "";
    };

    return (
        <div className="flex flex-row gap-1">
            <input
                type="text"
                placeholder={placeholder}
                ref={inputRef}
                onKeyUp={event => event.key === "Enter" && doSubmit()}
                className="border outline-1 grow placeholder:italic placeholder:text-sm placeholder:px-1"
            />
            <button className="px-2 font-bold text-white bg-blue-200 border hover:bg-blue-400" onClick={doSubmit}>
                {submitLabel}
            </button>
        </div>
    );
};
