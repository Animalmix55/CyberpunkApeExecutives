import React from 'react';
import { useStyletron } from 'styletron-react';
import CoverPhoto from '../assets/Cyberscape.png';

import Slideshow1 from '../assets/Animated/preview_animation_1.gif';
import Slideshow2 from '../assets/Animated/preview_animation_2.gif';
import Slideshow3 from '../assets/Animated/preview_animation_3.gif';

import useMobile from '../hooks/useMobile';

const slideshows = [Slideshow1, Slideshow2, Slideshow3];

export const Landing = (): JSX.Element => {
    const [css] = useStyletron();
    const isMobile = useMobile();

    const [target] = React.useState(
        slideshows[Math.floor(Math.random() * (slideshows.length - 1))]
    );

    return (
        <div>
            <div
                className={css({
                    backgroundImage: `url(${CoverPhoto})`,
                    backgroundSize: 'cover',
                    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...(isMobile && {
                        padding: '10px',
                        minHeight: 'calc(100vh - 75px)',
                    }),
                    ...(!isMobile && {
                        minHeight: '100vh',
                    }),
                })}
            >
                <div
                    className={css({
                        color: 'white',
                        padding: '20px',
                        backgroundColor: 'rgba(0, 0, 0, .4)',
                        margin: !isMobile ? '130px 20px 20px 20px' : '20px',
                        borderRadius: '20px',
                    })}
                >
                    <h1 className={css({ width: '100%', textAlign: 'center' })}>
                        Cyberpunk Executive Apes V2
                    </h1>
                    <img
                        src={target}
                        alt="Ape Slideshow"
                        className={css({
                            height: 'auto',
                            width: isMobile ? '100%' : '500px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Landing;
