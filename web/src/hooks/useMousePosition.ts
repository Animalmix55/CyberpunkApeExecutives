import React from 'react';

export const useMousePosition = (): MouseEvent => {
    const [mouseEvent, setMouseEvent] = React.useState(new MouseEvent(''));

    React.useEffect(() => {
        const mouseMoveHandler = setMouseEvent;

        window.addEventListener('mousemove', mouseMoveHandler);
        return (): void => {
            window.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);

    return mouseEvent;
};
export default useMousePosition;
