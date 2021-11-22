import React from 'react';

export const useMobile = (): boolean => {
    const [isMobile, setMobile] = React.useState(window.outerWidth <= 780);

    React.useEffect(() => {
        const onResize = (): void => {
            setMobile(window.outerWidth <= 780);
        };

        window.addEventListener('resize', onResize);

        return (): void => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return isMobile;
};

export default useMobile;
