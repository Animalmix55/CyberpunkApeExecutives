import React from 'react';
import { useStyletron } from 'styletron-react';
import { useResizeDetector } from 'react-resize-detector';
import useMousePosition from '../hooks/useMousePosition';
import Layer1 from '../assets/im_layer1.png';
import Layer2 from '../assets/im_layer2.png';
import Layer3 from '../assets/im_layer3.png';
import ClassNameBuilder from '../utilties/ClassNameBuilder';

interface Props {
    alt?: string;
    className?: string;
}
export const FollowingEye = (props: Props): JSX.Element => {
    const { className, alt } = props;

    const cursorPos = useMousePosition();
    const [css] = useStyletron();
    const {
        width,
        height,
        ref: imageRef,
    } = useResizeDetector<HTMLImageElement>();

    const scaleW = React.useMemo(() => (width || 0) / 2610, [width]);
    const scaleH = React.useMemo(() => (height || 0) / 2160, [height]);

    const EYELEFTOFFSET = React.useMemo(() => scaleW * 1309, [scaleW]);
    const EYETOPOFFSET = React.useMemo(() => scaleH * 1072, [scaleH]);
    const EYEHEIGHT = React.useMemo(() => scaleH * (414 - 100), [scaleH]);
    const EYEWIDTH = React.useMemo(() => scaleW * (824 - 300), [scaleW]);

    const localEyePos = React.useMemo(() => {
        if (!imageRef.current) return { x: 0, y: 0 };

        const inputX =
            cursorPos.clientX -
            ((imageRef.current?.getBoundingClientRect().left || 0) +
                EYELEFTOFFSET);
        const inputY =
            cursorPos.clientY -
            ((imageRef.current?.getBoundingClientRect().top || 0) +
                EYETOPOFFSET);

        if (Math.abs(inputX) < EYEWIDTH / 2 && Math.abs(inputY) < EYEHEIGHT / 2)
            return { x: inputX, y: inputY };

        const slope = inputY / inputX;
        const resultX =
            (inputX >= 0 ? 1 : -1) *
            Math.sqrt(
                1 /
                    (1 / Math.pow(EYEWIDTH / 2, 2) +
                        Math.pow(slope, 2) / Math.pow(EYEHEIGHT / 2, 2))
            );

        const resultY = slope * resultX;

        return { x: resultX, y: resultY };
    }, [
        EYEHEIGHT,
        EYELEFTOFFSET,
        EYETOPOFFSET,
        EYEWIDTH,
        cursorPos.clientX,
        cursorPos.clientY,
        imageRef,
    ]);

    return (
        <div
            className={ClassNameBuilder(
                className,
                css({ position: 'relative' })
            )}
            ref={imageRef}
        >
            <img
                alt={alt}
                className={css({
                    width: 'auto',
                    height: '100%',
                })}
                src={Layer3}
            />
            <img
                alt={alt}
                className={css({
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    transform: `translate(${localEyePos.x}px, ${localEyePos.y}px)`,
                    width: 'auto',
                    height: '100%',
                })}
                src={Layer2}
            />
            <img
                alt={alt}
                className={css({
                    width: 'auto',
                    left: '0',
                    top: '0',
                    position: 'absolute',
                    height: '100%',
                })}
                src={Layer1}
            />
        </div>
    );
};

export default FollowingEye;
