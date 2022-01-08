import React from 'react';
import { useStyletron } from 'styletron-react';

import Isis from '../assets/Team/Isis Sakura.gif';
import Olly from '../assets/Team/Olly Bellwhether.gif';
import Seth from '../assets/Team/Seth Horus.gif';
import Cash from '../assets/Team/CA$H.gif';
import Admiral from '../assets/Team/Admiral Tlaloc Rayamantra.gif';
import Octavian from '../assets/Team/Octavian Saisho The First APE.gif';
import useMobile from '../hooks/useMobile';

export const Team = (): JSX.Element => {
    const [css] = useStyletron();
    const isMobile = useMobile();

    return (
        <div>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    padding: isMobile ? '10px' : '20px',
                })}
            >
                <div
                    className={css({
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, .4)',
                        borderRadius: '20px',
                        width: '100%',
                    })}
                >
                    <h1>The Team</h1>
                    <div
                        className={css({
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
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
                            <img
                                src={Seth}
                                alt="Seth Horus"
                                className={css({
                                    width: isMobile ? '100%' : '350px',
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
                                Seth Horus
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
                            <img
                                src={Isis}
                                alt="Isis Sakura"
                                className={css({
                                    width: isMobile ? '100%' : '350px',
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
                                Isis Sakura
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
                            <img
                                src={Octavian}
                                alt="Octavian Saisho The First APE"
                                className={css({
                                    width: isMobile ? '100%' : '350px',
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
                                Octavian Saisho The First APE
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
                            <img
                                src={Cash}
                                alt="CASH"
                                className={css({
                                    width: isMobile ? '100%' : '350px',
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
                                CA$H
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
                            <img
                                src={Admiral}
                                alt="Admiral Tlaloc Rayamantra"
                                className={css({
                                    width: isMobile ? '100%' : '350px',
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
                                Admiral Tlaloc Rayamantra
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
                            <img
                                src={Olly}
                                alt="Olly Bellwether"
                                className={css({
                                    width: isMobile ? '100%' : '350px',
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
                                Olly Bellwether
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
