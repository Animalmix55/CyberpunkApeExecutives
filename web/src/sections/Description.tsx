import React from 'react';
import { useStyletron } from 'styletron-react';
import useMobile from '../hooks/useMobile';
import Isis from '../assets/Project/isis_header.png';
import Harddrives from '../assets/Project/hard_drives_header.png';
import IsisUpset from '../assets/Project/isis_upset_header.jpg';
import Repairs from '../assets/Project/repairs_header.png';
import { MOBILE } from '../utilties/MediaQueries';

export const Description = (): JSX.Element => {
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
                        padding: '20px',
                        backgroundColor: 'rgba(0, 0, 0, .4)',
                        borderRadius: '20px',
                        maxWidth: '1000px',
                    })}
                >
                    <img
                        src={Isis}
                        className={css({ width: '100%', height: 'auto' })}
                        alt="Isis"
                    />
                    <h1
                        className={css({
                            width: '100%',
                            textAlign: 'center',
                            margin: '30px',
                        })}
                    >
                        Dear Intrepid NFT-er. We are boned!
                    </h1>
                    <div
                        className={css({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            [MOBILE]: {
                                flexDirection: 'column',
                            },
                        })}
                    >
                        <img
                            src={Repairs}
                            className={css({
                                width: '50%',
                                height: 'auto',
                                [MOBILE]: {
                                    width: '100%',
                                },
                            })}
                            alt="Repairs"
                        />
                        <div className={css({ padding: '30px' })}>
                            An interdimensional portal has opened up in the
                            International Megadigital CONTENT FACTORY™. It has
                            sucked thousands of Unpaid Interns into the Shadow
                            Zone. I don&apos;t really care about the Interns,
                            but I do care that the hard drives containing THE
                            CONTENT THEY&apos;VE CREATED were sucked in with
                            them. Until we get those files back, there&apos;s no
                            way to monetize them to make HOT INTERNET DOLLARS™.
                        </div>
                    </div>
                    <div
                        className={css({
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row-reverse',
                            justifyContent: 'center',
                            [MOBILE]: {
                                flexDirection: 'column',
                            },
                        })}
                    >
                        <img
                            src={Harddrives}
                            className={css({
                                width: '50%',
                                height: 'auto',
                                [MOBILE]: {
                                    width: '100%',
                                },
                            })}
                            alt="Harddrives"
                        />
                        <div className={css({ padding: '30px' })}>
                            Only you can help me. I&apos;ve already maxed out my
                            A.P.E. hiring budget, so it&apos;s imperative that
                            you help me hire 3000 more A.P.E.s to help me close
                            this portal. By hitting the mint button, you will
                            hire an Ape Executive Consultant who has the
                            necessary, super-intelligent brain power to deal
                            with time-space anomalies. In exchange, I will be
                            giving you all extra College $CREDIT for as long as
                            you&apos;re footing the bill for your A.P.E.
                        </div>
                    </div>
                    <div
                        className={css({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            [MOBILE]: {
                                flexDirection: 'column',
                            },
                        })}
                    >
                        <img
                            src={IsisUpset}
                            className={css({
                                width: '50%',
                                height: 'auto',
                                [MOBILE]: {
                                    width: '100%',
                                },
                            })}
                            alt="Isis Upset"
                        />
                        <div className={css({ padding: '30px' })}>
                            I was supposed to be drinking rosé with my mistress
                            on the Napa Wine Planet, but here I am shilling to
                            fix this mess. I&apos;m embarrassed for myself. So
                            after writing this, I&apos;m gonna take like 12
                            sleeping pills. When I wake up, hopefully, all the
                            new A.P.E.s get hired and this whole situation
                            becomes just a distant memory.
                        </div>
                    </div>
                    <div
                        className={css({
                            width: '100%',
                            textAlign: 'center',
                            margin: '30px',
                        })}
                    >
                        -Sincerely, Isis Sakura
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Description;
