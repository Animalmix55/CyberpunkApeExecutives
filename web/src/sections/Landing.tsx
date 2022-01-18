import React from 'react';
import { useStyletron } from 'styletron-react';
import CoverPhoto from '../assets/Cyberscape.png';

import Slideshow from '../assets/Animated/preview_animation.gif';

import useMobile from '../hooks/useMobile';

export const Landing = (): JSX.Element => {
    const [css] = useStyletron();
    const isMobile = useMobile();

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
                    <h1
                        className={css({
                            width: '100%',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                        })}
                    >
                        Cyberpunk Ape Executives
                    </h1>
                    <img
                        src={Slideshow}
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
