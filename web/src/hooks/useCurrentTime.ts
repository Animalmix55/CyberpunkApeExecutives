import React from 'react';

const heartbeatHandlers: ((time: number) => void)[] = [];

const subscribe = (handler: (time: number) => void): (() => void) => {
    heartbeatHandlers.push(handler);

    return (): void => {
        delete heartbeatHandlers[heartbeatHandlers.indexOf(handler)];
    };
};

setInterval(() => heartbeatHandlers.forEach((h) => h(Date.now() / 1000)), 1000);

/**
 * @returns The current time in unix seconds
 */
export const useCurrentTime = (): number => {
    const [time, setTime] = React.useState(Date.now() / 1000);

    React.useEffect(() => {
        return subscribe(setTime);
    }, []);

    return time;
};

export default useCurrentTime;
