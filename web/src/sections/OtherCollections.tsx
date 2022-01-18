import React from 'react';
import { useStyletron } from 'styletron-react';
import BG from '../assets/Urban cyberpunk.png';
import useMobile from '../hooks/useMobile';

import Bootleg2 from '../assets/Bootlegs/2.png';
import Bootleg3 from '../assets/Bootlegs/3.png';
import Bootleg4 from '../assets/Bootlegs/4.png';
import Bootleg5 from '../assets/Bootlegs/5.png';

import Genesis2 from '../assets/Genesis/2.gif';
import Genesis3 from '../assets/Genesis/3.gif';
import Genesis4 from '../assets/Genesis/4.gif';
import Genesis5 from '../assets/Genesis/5.gif';

import Slideshow from '../atoms/Slideshow';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useThemeContext } from '../contexts/ThemeContext';

const bootlegs = [Bootleg3, Bootleg4, Bootleg2, Bootleg5];
const genesis = [Genesis2, Genesis3, Genesis4, Genesis5];

export const OtherCollections = (): JSX.Element => {
    const [css] = useStyletron();
    const isMobile = useMobile();
    const { bootlegUrl, genesisUrl } = useCyberpunkApesContext();
    const theme = useThemeContext();

    return (
        <div>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: `url(${BG})`,
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.3)',
                    padding: isMobile ? '10px' : '20px',
                })}
            >
                <div
                    className={css({
                        color: 'white',
                        padding: '20px',
                        backgroundColor: 'rgba(0, 0, 0, .4)',
                        borderRadius: '20px',
                    })}
                >
                    <h1>Previous Collections</h1>
                    <div
                        className={css({
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                        })}
                    >
                        <div
                            className={css({
                                position: 'relative',
                                margin: isMobile ? '10px' : '20px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                width: isMobile ? '100%' : undefined,
                            })}
                        >
                            <Slideshow
                                imageUrls={genesis}
                                duration={3000}
                                imageClass={css({
                                    width: isMobile ? '100%' : '500px',
                                    height: 'auto',
                                })}
                            />
                            <h2
                                className={css({
                                    position: 'absolute',
                                    bottom: '0px',
                                    padding: '10px',
                                    left: '0px',
                                    textAlign: 'center',
                                    right: '0px',
                                    margin: 'auto',
                                    backgroundColor: 'rgba(0, 0, 0, .4)',
                                })}
                            >
                                <a
                                    href={genesisUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={css({
                                        color: theme.fontColors.normal.primary.getCSSColor(
                                            1
                                        ),
                                    })}
                                >
                                    Cyberpunk Ape Executives GENESIS
                                </a>
                            </h2>
                        </div>
                        <div
                            className={css({
                                position: 'relative',
                                margin: isMobile ? '10px' : '20px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                width: isMobile ? '100%' : undefined,
                            })}
                        >
                            <Slideshow
                                imageUrls={bootlegs}
                                duration={3000}
                                imageClass={css({
                                    width: isMobile ? '100%' : '500px',
                                    height: 'auto',
                                })}
                            />
                            <h2
                                className={css({
                                    position: 'absolute',
                                    bottom: '0px',
                                    padding: '10px',
                                    left: '0px',
                                    textAlign: 'center',
                                    right: '0px',
                                    margin: 'auto',
                                    backgroundColor: 'rgba(0, 0, 0, .4)',
                                })}
                            >
                                <a
                                    href={bootlegUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={css({
                                        color: theme.fontColors.normal.primary.getCSSColor(
                                            1
                                        ),
                                    })}
                                >
                                    Bootleg Cyberpunk Ape Executives
                                </a>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherCollections;
