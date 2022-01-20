import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { useStyletron } from 'styletron-react';
import jazzicon from '@metamask/jazzicon';
import { TooltipHost } from '@fluentui/react';
import MetaMaskLogo from '../assets/MetaMaskLogo.png';
import { Button, ButtonType } from './Button';
import useWeb3 from '../contexts/Web3Context';
import { MOBILE } from '../utilties/MediaQueries';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const MetaMaskButton = (props: Props): JSX.Element => {
    const { className, style, disabled } = props;
    const [css] = useStyletron();
    const iconRef = React.useRef<HTMLDivElement>(null);
    const { accounts, reload } = useWeb3();

    const metaMaskInstalled = React.useMemo(
        () => MetaMaskOnboarding.isMetaMaskInstalled(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [accounts]
    );

    const onboarding = React.useRef<MetaMaskOnboarding>();

    React.useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    React.useEffect(() => {
        if (accounts.length > 0 && metaMaskInstalled) {
            onboarding.current?.stopOnboarding();
        }
    }, [accounts, metaMaskInstalled]);

    const onClick = (): void => {
        reload().then((prov) => {
            if (prov) {
                prov.request({ method: 'eth_requestAccounts' });
            } else {
                onboarding.current?.startOnboarding();
            }
        });
    };

    const child = React.useRef<HTMLElement>();
    React.useEffect(() => {
        if (child.current) {
            iconRef.current?.removeChild(child.current);
            child.current = undefined;
        }
        if (!accounts[0]) return;
        child.current = iconRef.current?.appendChild(
            jazzicon(30, Number(accounts[0]))
        );
    }, [accounts]);

    return (
        <Button
            buttonType={ButtonType.wireframe}
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '10px',
                paddingRight: '10px',
            }}
            type="button"
            disabled={accounts.length > 0 || disabled}
            onClick={onClick}
            className={className}
        >
            <div ref={iconRef} />
            {!accounts[0] && metaMaskInstalled && (
                <img
                    src={MetaMaskLogo}
                    className={css({
                        height: '70%',
                        width: 'auto',
                        marginRight: '10px',
                    })}
                    alt="Connect MetaMask"
                />
            )}
            <span
                className={css({
                    maxWidth: '100px',
                    textOverflow: 'ellipsis',
                    direction: 'rtl',
                    overflow: 'hidden',
                    [MOBILE]: {
                        maxWidth: 'unset',
                    },
                })}
            >
                <TooltipHost content={accounts[0]}>
                    {accounts[0] || 'Connect'}
                </TooltipHost>
            </span>
        </Button>
    );
};

export default MetaMaskButton;
