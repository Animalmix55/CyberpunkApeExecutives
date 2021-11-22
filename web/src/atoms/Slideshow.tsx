import React from 'react';

interface Props {
    imageUrls: string[];
    duration?: number;
    imageClass?: string;
}
export const Slideshow = (props: Props): JSX.Element => {
    const { imageUrls, duration, imageClass } = props;

    const [index, setIndex] = React.useState(0);

    const interval = React.useRef<NodeJS.Timer>();
    React.useEffect(() => {
        interval.current = setInterval(() => {
            setIndex((i) => {
                if (i >= imageUrls.length - 1) return 0;
                return i + 1;
            });
        }, duration);

        return (): void => {
            clearInterval(interval.current);
            interval.current = undefined;
        };
    }, [duration, imageUrls]);

    return (
        <div className="slideshow">
            <img className={imageClass} alt="" src={imageUrls[index]} />
        </div>
    );
};

export default Slideshow;
