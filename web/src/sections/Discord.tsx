import React from 'react';
import { useStyletron } from 'styletron-react';
import BG from '../assets/megadigitalHQ.jpg';
import InternPoster from '../assets/poster.jpg';
import Button, { ButtonType } from '../atoms/Button';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import useMobile from '../hooks/useMobile';

export const Discord = (): JSX.Element => {
    const [css] = useStyletron();
    const isMobile = useMobile();
    const { discordUrl } = useCyberpunkApesContext();

    return (
        <div>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundImage: `url(${BG})`,
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    alignItems: 'center',
                })}
            >
                <div
                    className={css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    })}
                >
                    <div
                        className={css({
                            margin: '20px',
                            color: 'white',
                            padding: '20px',
                            backgroundColor: 'rgba(0, 0, 0, .4)',
                            borderRadius: '20px',
                            alignSelf: 'stretch',
                            display: 'flex',
                            flexDirection: 'column',
                        })}
                    >
                        <h1>Become an Intern Today</h1>
                        <div
                            className={css({
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                flex: 1,
                            })}
                        >
                            <div className={css({ marginBottom: '10px' })}>
                                Nam sint quaerat et voluptas deleniti sed
                                repellendus error et nisi ducimus qui eius
                                recusandae? Et nulla laboriosam hic galisum
                                fugit vel consectetur laboriosam eum optio
                                repellat. Est facilis impedit quo itaque cumque
                                et eligendi delectus quo tempora explicabo et
                                dicta officiis id voluptate temporibus eum vero
                                quam. Sed sapiente atque aut autem possimus qui
                                autem nesciunt sed voluptas fugit aut aperiam
                                blanditiis eos dolor doloremque. Sed omnis
                                itaque et commodi omnis ut consequatur nemo ex
                                aliquid iste. Ea praesentium ducimus non
                                praesentium voluptates sit magni rerum! Quo
                                voluptatibus repellat eos quis veritatis ut
                                laborum consectetur.
                            </div>
                            <Button
                                className={css({
                                    padding: '20px',
                                    width: '100%',
                                    marginTop: 'auto',
                                })}
                                buttonType={ButtonType.wireframe}
                                onClick={(): void => {
                                    window.location.href = discordUrl;
                                }}
                            >
                                Join Our Discord
                            </Button>
                        </div>
                    </div>
                    {!isMobile && (
                        <img
                            src={InternPoster}
                            className={css({ width: '300px', margin: '20px' })}
                            alt="Intern Poster"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discord;
