import { FunctionComponent } from "react";

const NOT_INTERESTING = ["www"];

interface Props {
    hostname: string;
    extraClasses?: string;
}

export const Hostname: FunctionComponent<Props> = ({ hostname, extraClasses = "" }) => {
    if (hostname.match(/^\d{1,3}(\.\d{1,3}){3}/)) {
        return <span className={`font-bold not-italic px-1 text-base ${extraClasses}`}>{hostname}</span>;
    }

    let found_interesting = false;
    const out = hostname.split(".").flatMap((label, idx) => {
        if (!found_interesting && !NOT_INTERESTING.includes(label)) {
            found_interesting = true;
            return [
                <span key={`${label}-${idx}`} className="text-base not-italic font-bold">
                    {label}
                </span>,
                ".",
            ];
        }
        return [label, "."];
    });

    return <span className={`italic text-sm px-1 ${extraClasses}`}>{out.slice(0, -1)}</span>;
};
