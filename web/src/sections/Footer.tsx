import React from 'react';
import { useStyletron } from 'styletron-react';
import { SocialIcon } from 'react-social-icons';
import useMobile from '../hooks/useMobile';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';

export const Footer = (): JSX.Element => {
    const [css] = useStyletron();
    const isMobile = useMobile();
    const { twitterUrl, discordUrl } = useCyberpunkApesContext();

    return (
        <div
            className={css({
                height: isMobile ? '250px' : '100px',
                backgroundColor: 'black',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 30px 10px 30px',
                flexDirection: isMobile ? 'column-reverse' : 'row',
                position: 'relative',
            })}
        >
            <div
                className={css({
                    ...(isMobile && {
                        position: 'absolute',
                        bottom: '0px',
                        zIndex: 100,
                        margin: '10px',
                    }),
                })}
            >
                © 2021 Cyberpunk Apes. All rights reserved
            </div>
            <div
                className={css({
                    position: !isMobile ? 'fixed' : undefined,
                    bottom: '30px',
                    right: '30px',
                    marginLeft: 'auto',
                    marginRight: isMobile ? 'auto' : undefined,
                    marginBottom: isMobile ? '20px' : undefined,
                })}
            >
                <SocialIcon
                    url={twitterUrl}
                    bgColor="white"
                    style={{
                        height: '50px',
                        width: '50px',
                    }}
                    className={css({
                        margin: '5px',
                    })}
                />
                <SocialIcon
                    style={{
                        height: '50px',
                        width: '50px',
                    }}
                    url={discordUrl}
                    bgColor="white"
                    className={css({ margin: '5px' })}
                />
            </div>
        </div>
    );
};

export default Footer;
