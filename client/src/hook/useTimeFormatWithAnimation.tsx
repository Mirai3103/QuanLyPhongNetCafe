import React from "react";
import { toTimeString } from "../../../server/src/utils/helper";

export default function useTimeFormatWithAnimation(time: number, interval: number = 1000) {
    const [timeFormat, setTimeFormat] = React.useState(toTimeString(time));
    React.useLayoutEffect(() => {
        const intervalId = setInterval(() => {
            setTimeFormat((pre) => (pre.includes(":") ? toTimeString(time, false) : toTimeString(time)));
        }, interval);
        return () => clearInterval(intervalId);
    }, [time]);
    React.useEffect(() => {
        setTimeFormat(toTimeString(time));
    }, [time]);
    return timeFormat;
}
