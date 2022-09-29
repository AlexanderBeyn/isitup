import { FunctionComponent } from "react";
import { pinger } from "../../wailsjs/go/models";
import activityIcon from "../assets/images/activity.svg";
import alertTriangle from "../assets/images/alert-triangle.svg";
import arrowDownIcon from "../assets/images/arrow-down.svg";
import arrowUpIcon from "../assets/images/arrow-up.svg";
import { format_ago } from "../utils";
import { Hostname } from "./Hostname";
import { Value } from "./Value";

interface Props {
    p: pinger.PingEvent;
}

const get_info = (p: pinger.PingEvent) => {
    if (p.error) {
        return (
            <>
                <img src={alertTriangle} className="h-4" />
                <span className="italic">{p.error.message}</span>
            </>
        );
    }

    if (p.bad) {
        return (
            <>
                <Value value={format_ago(p.bad.last_good)} icon={arrowDownIcon} />
                <Value value="--" icon={activityIcon} suffix="s" />
            </>
        );
    }

    if (p.good) {
        return (
            <>
                <Value value={format_ago(p.good.last_bad)} icon={arrowUpIcon} />
                <Value value={(p.good.rtt / 1_000_000_000).toFixed(2)} icon={activityIcon} suffix="s" />
            </>
        );
    }
};

export const PingLine: FunctionComponent<Props> = ({ p }) => (
    <div className="flex flex-row items-center gap-2">
        <Hostname hostname={p.destination} extraClasses={"good" in p ? "bg-green-200" : "bg-red-200"} />
        {get_info(p)}
    </div>
);
