import { FunctionComponent } from "react";

interface Props {
    value: string;
    suffix?: string;
    icon?: string;
    iconClasses?: string;
}

export const Value: FunctionComponent<Props> = ({ value, suffix, icon, iconClasses = "" }) => (
    <div className="flex flex-row items-center gap-1">
        {icon && <img src={icon} className={`h-4 opacity-50 ${iconClasses}`} />}
        <span>{value}</span>
        {suffix && <span className="italic">{suffix}</span>}
    </div>
);
