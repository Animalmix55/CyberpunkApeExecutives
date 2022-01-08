import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { useStyletron } from 'styletron-react';
import jazzicon from '@metamask/jazzicon';
import MetaMaskLogo from '../assets/MetaMaskLogo.png';
import { Button, ButtonType } from './Button';
import useWeb3 from '../contexts/Web3Context';

const ONBOARD_TEXT = 'Install';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const MetaMaskButton = (props: Props): JSX.Element => {
    const { className, style, disabled: disabledProp } = props;
    const [css] = useStyletron();
    const iconRef = React.useRef<HTMLDivElement>(null);

    const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
    const [isDisabled, setDisabled] = React.useState(false);
    const { accounts, login } = useWeb3();

    const onboarding = React.useRef<MetaMaskOnboarding>();

    React.useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    React.useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (accounts.length > 0) {
                setButtonText(CONNECTED_TEXT);
                setDisabled(true);
                onboarding.current.stopOnboarding();
            } else {
                setButtonText(CONNECT_TEXT);
                setDisabled(false);
            }
        }
    }, [accounts]);

    const child = React.useRef<HTMLElement>();
    React.useEffect(() => {
        if (child.current) {
            iconRef.current.removeChild(child.current);
            child.current = undefined;
        }
        if (!accounts[0]) return;
        child.current = iconRef.current.appendChild(
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
                justifyContent: 'center',
                paddingLeft: '10px',
                paddingRight: '10px',
            }}
            type="button"
            disabled={isDisabled || disabledProp}
            onClick={login}
            className={className}
        >
            <div ref={iconRef} />
            {!accounts[0] && (
                <img
                    src={MetaMaskLogo}
                    className={css({ height: '70%', width: 'auto' })}
                    alt="Connect MetaMask"
                />
            )}
            <span className={css({ marginLeft: '10px' })}>{buttonText}</span>
        </Button>
    );
};

export default MetaMaskButton;
