import React from 'react';
import { useStyletron } from 'styletron-react';
import CoverPhoto from '../assets/Cyberscape.png';

import Example1 from '../assets/tSkeyhXw.png';
import Example2 from '../assets/preview-v19.png';
import Example3 from '../assets/q_7srp8V.png';
import Example4 from '../assets/R7lFuDmr.png';
import Example5 from '../assets/preview-v31.png';

import useMobile from '../hooks/useMobile';
import Slideshow from '../atoms/Slideshow';

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
                    <h1>Cyberpunk Executive Apes V2</h1>
                    <Slideshow
                        duration={2000}
                        imageUrls={[
                            Example1,
                            Example2,
                            Example3,
                            Example4,
                            Example5,
                        ]}
                        imageClass={css({
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
