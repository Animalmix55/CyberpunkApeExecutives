import React from 'react';
import { useStyletron } from 'styletron-react';
import Hamburger from 'hamburger-react';
import { useScrollSection } from 'react-scroll-section';
import { useHistory, useLocation } from 'react-router';
import { SocialIcon } from 'react-social-icons';
import Button, { ButtonType } from '../../atoms/Button';
import { ClassNameBuilder } from '../../utilties/ClassNameBuilder';
import { useThemeContext } from '../../contexts/ThemeContext';
import useMobile from '../../hooks/useMobile';
import { useCyberpunkApesContext } from '../../contexts/CyberpunkApesContext';
import FollowingEye from '../../atoms/FollowingEye';
import { Page } from '../../routing/ApeRouter';
import useMintDetails from '../../hooks/useMintDetails';
import useCurrentTime from '../../hooks/useCurrentTime';
import { FormatLargestTimeUnit } from '../../utilties/TimeFormatter';

export const HeaderMintButton = ({
    style,
}: {
    style: React.CSSProperties;
}): JSX.Element => {
    const { startDate: publicStartDate } = useMintDetails('public');
    const { startDate: presaleStartDate } = useMintDetails('presale');
    const currentTime = useCurrentTime();

    const history = useHistory();
    const [css] = useStyletron();

    const timeUntilPublic = React.useMemo(
        () => publicStartDate - currentTime,
        [currentTime, publicStartDate]
    );

    const timeUntilPresale = React.useMemo(
        () => presaleStartDate - currentTime,
        [currentTime, presaleStartDate]
    );

    const lastPublic = React.useRef(currentTime);
    const showPublic = React.useMemo(() => {
        if (timeUntilPresale <= 0) return true;
        if (currentTime - lastPublic.current < 5) {
            return true;
        }
        if (currentTime - lastPublic.current > 10) {
            lastPublic.current = currentTime;
            return true;
        }
        return false;
    }, [currentTime, timeUntilPresale]);

    return (
        <Button
            style={style}
            className={ClassNameBuilder(
                css({
                    marginLeft: 'auto',
                    marginRight: 'auto',
                })
            )}
            buttonType={ButtonType.wireframe}
            onClick={(): void => history.push(Page.Mint)}
        >
            <div>Go to Mint Page</div>
            {showPublic &&
                timeUntilPublic > 0 &&
                timeUntilPublic !== Infinity && (
                    <div className={css({ fontSize: '10px' })}>
                        {FormatLargestTimeUnit(timeUntilPublic)} Until Public
                        Sale
                    </div>
                )}
            {!showPublic && timeUntilPresale !== Infinity && (
                <div className={css({ fontSize: '10px' })}>
                    {FormatLargestTimeUnit(timeUntilPresale)} Until Presale
                </div>
            )}
        </Button>
    );
};

export const Header = (): JSX.Element => {
    const history = useHistory();
    const { pathname } = useLocation();

    const goHomeBefore = React.useCallback(
        (callback: () => void): void => {
            if (pathname !== '/') {
                const u = history.listen(() => {
                    setTimeout(callback, 500);
                    u();
                });
                history.push('/');
            } else callback();
        },
        [history, pathname]
    );

    const home = useScrollSection('Landing');
    const project = useScrollSection('Project');
    const otherCollections = useScrollSection('OtherCollections');
    const team = useScrollSection('Team');
    const faq = useScrollSection('FAQ');

    const [css] = useStyletron();
    const [scrollTop, setScrollTop] = React.useState(0);
    const isMobile = useMobile();
    const {
        discordUrl,
        twitterUrl,
        tokenContractAddress,
        stakingContractAddress,
        creditContractAddress,
        lengendsContractAddress,
    } = useCyberpunkApesContext();

    const [isOpen, setOpen] = React.useState(false);

    const ref = React.useRef<HTMLDivElement>(null);

    const theme = useThemeContext();

    React.useEffect(() => {
        const onScroll = (): void => {
            setScrollTop(window.scrollY);
        };
        window.addEventListener('scroll', onScroll);

        return (): void => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const collapsed = React.useMemo(() => {
        if (!ref.current) return false;
        if (scrollTop >= ref.current.getBoundingClientRect().height / 2)
            return true;
        return false;
    }, [scrollTop]);

    const buttonStyle = React.useMemo(
        (): React.CSSProperties => ({
            fontSize: 'inherit',
            transition: 'font-size 1s',
            paddingLeft: '15px',
            paddingRight: '15px',
            textTransform: 'uppercase',
            maxWidth: 'fit-content',
            ...(isMobile && {
                paddingTop: '15px',
                paddingBottom: '15px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
            }),
        }),
        [isMobile]
    );

    const buttons = React.useMemo(
        () => (
            <>
                <Button
                    style={{
                        ...buttonStyle,
                        color: home.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="home_button"
                    onClick={(): void => goHomeBefore(home.onClick)}
                >
                    Home
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: project.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="project_button"
                    onClick={(): void => goHomeBefore(project.onClick)}
                >
                    The Project
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: otherCollections.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="otherCollections_button"
                    onClick={(): void => goHomeBefore(otherCollections.onClick)}
                >
                    Previous Collections
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: team.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="team_button"
                    onClick={(): void => goHomeBefore(team.onClick)}
                >
                    Our Team
                </Button>
                <Button
                    style={{
                        ...buttonStyle,
                        color: faq.selected
                            ? theme.fontColors.hovered.primary.getCSSColor(1)
                            : undefined,
                    }}
                    buttonType={ButtonType.clear}
                    key="faq_button"
                    onClick={(): void => goHomeBefore(faq.onClick)}
                >
                    FAQ
                </Button>
                {stakingContractAddress && (
                    <Button
                        style={{
                            ...buttonStyle,
                            color:
                                pathname === Page.Staking
                                    ? theme.fontColors.hovered.primary.getCSSColor(
                                          1
                                      )
                                    : undefined,
                        }}
                        buttonType={ButtonType.clear}
                        key="staking_button"
                        onClick={(): void => history.push(Page.Staking)}
                    >
                        Staking
                    </Button>
                )}
                {creditContractAddress && lengendsContractAddress && (
                    <Button
                        style={{
                            ...buttonStyle,
                            color:
                                pathname === Page.Legends
                                    ? theme.fontColors.hovered.primary.getCSSColor(
                                          1
                                      )
                                    : undefined,
                        }}
                        buttonType={ButtonType.clear}
                        key="legends_button"
                        onClick={(): void => history.push(Page.Legends)}
                    >
                        CAE Legends
                    </Button>
                )}
            </>
        ),
        [
            buttonStyle,
            home.selected,
            home.onClick,
            theme.fontColors.hovered.primary,
            project.selected,
            project.onClick,
            otherCollections.selected,
            otherCollections.onClick,
            team.selected,
            team.onClick,
            faq.selected,
            faq.onClick,
            stakingContractAddress,
            pathname,
            creditContractAddress,
            lengendsContractAddress,
            goHomeBefore,
            history,
        ]
    );

    const fontSize = React.useMemo(() => {
        if (isMobile) return '30px';

        return collapsed ? '20px' : '25px';
    }, [isMobile, collapsed]);

    const bannerMinHeight = React.useMemo(() => {
        if (isMobile) {
            return 75;
        }
        return collapsed ? 50 : 110;
    }, [collapsed, isMobile]);

    return (
        <div
            className={css({
                position: isMobile ? 'sticky' : 'fixed',
                top: '0px',
                left: '0px',
                right: '0px',
                fontSize,
                zIndex: 100000,
                height: isMobile && isOpen ? '100%' : undefined,
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <div
                className={css({
                    minHeight: `${bannerMinHeight}px`,
                    backgroundColor:
                        collapsed || isMobile
                            ? theme.backgroundColor.getCSSColor(1)
                            : theme.backgroundColor.getCSSColor(0.4),
                    display: 'flex',
                    transition: 'min-height 1s, background 1s',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                })}
            >
                <div
                    ref={ref}
                    className={ClassNameBuilder(
                        'nav-header',
                        css({
                            height: '100%',
                            fontSize,
                            display: 'flex',
                            transition: 'height 1s, background 1s',
                            alignItems: 'center',
                            marginLeft: '30px',
                            marginRight: '30px',
                            flex: '1',
                            width: isMobile ? '100%' : undefined,
                        })
                    )}
                >
                    <FollowingEye
                        alt="International Megadigital"
                        className={css({
                            height: `${bannerMinHeight - 15}px`,
                            transition: 'height 1s, background 1s',
                        })}
                    />
                    {isMobile && (
                        <div className={css({ marginLeft: 'auto' })}>
                            <Hamburger
                                toggled={isOpen}
                                color={theme.fontColors.normal.primary.getCSSColor(
                                    1
                                )}
                                onToggle={setOpen}
                            />
                        </div>
                    )}
                    {!isMobile && (
                        <div
                            className={ClassNameBuilder(
                                'nav-buttons',
                                css({
                                    marginLeft: '10px',
                                    flex: '1',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                })
                            )}
                        >
                            <div
                                className={css({
                                    marginLeft: '40px',
                                    marginRight: '40px',
                                    flex: '1',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                })}
                            >
                                {buttons}
                            </div>
                            {tokenContractAddress && (
                                <HeaderMintButton style={buttonStyle} />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div
                className={css({
                    backgroundColor: theme.backgroundColor.getCSSColor(0.9),
                    height: isMobile && isOpen ? undefined : '0px',
                    overflow: isMobile && isOpen ? 'auto' : 'hidden',
                    paddingBottom: isMobile && isOpen ? '20px' : undefined,
                    paddingTop: isMobile && isOpen ? '20px' : undefined,
                    flex: isMobile && isOpen ? '1' : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                })}
            >
                {buttons}
                {tokenContractAddress && (
                    <Button
                        style={buttonStyle}
                        className={ClassNameBuilder(
                            css({
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            })
                        )}
                        buttonType={ButtonType.wireframe}
                        onClick={(): void => history.push(Page.Mint)}
                    >
                        Mint
                    </Button>
                )}
                <div
                    className={css({
                        marginTop: 'auto',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
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
        </div>
    );
};

export default Header;
