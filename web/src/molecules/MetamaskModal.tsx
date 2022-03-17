import { Checkbox } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import MetaMaskButton from '../atoms/MetamaskButton';
import { useThemeContext } from '../contexts/ThemeContext';
import useWeb3 from '../contexts/Web3Context';
import Terms from '../assets/Cyberpunk Ape Executives Terms of Use - 1.6.22.pdf';
import ModalBase from '../atoms/ModalBase';

export const MetamaskModal = (): JSX.Element => {
    const { accounts } = useWeb3();
    const theme = useThemeContext();
    const [css] = useStyletron();
    const [agreed, setAgreed] = React.useState(false);
    const isOpen = React.useMemo(() => !accounts[0], [accounts]);
    const { provider } = useWeb3();

    const isMetaMask = React.useMemo(
        () => !!provider?.isMetaMask as boolean,
        [provider]
    );
    const isCoinbase = React.useMemo(
        () => !!provider?.isCoinbaseWallet as boolean,
        [provider]
    );

    const web3Provider = React.useMemo(() => {
        if (isMetaMask) return 'MetaMask';
        if (isCoinbase) return 'Coinbase Wallet';
        return 'Web3';
    }, [isCoinbase, isMetaMask]);

    return (
        <ModalBase isOpen={isOpen}>
            <h1 className={css({ textAlign: 'center' })}>
                Connect {web3Provider}
            </h1>
            <div className={css({ display: 'flex' })}>
                <Checkbox
                    checked={agreed}
                    styles={{
                        text: {
                            color: `${theme.fontColors.normal.primary.getCSSColor(
                                1
                            )} !important`,
                        },
                        checkbox: {
                            color: `${theme.fontColors.normal.primary.getCSSColor(
                                1
                            )} !important`,
                        },
                    }}
                    onChange={(_, v): void => {
                        setAgreed(!!v);
                    }}
                />
                <span
                    role="checkbox"
                    aria-checked={agreed}
                    onClick={(): void => setAgreed((v) => !v)}
                    tabIndex={0}
                    onKeyDown={(): void => setAgreed((v) => !v)}
                    className={css({ cursor: 'pointer', marginBottom: '10px' })}
                >
                    By connecting, I agree to the{' '}
                    <a
                        href={Terms}
                        className={css({
                            color: theme.fontColors.normal.primary.getCSSColor(
                                1
                            ),
                        })}
                        target="_blank"
                        rel="noreferrer"
                    >
                        terms of service
                    </a>
                </span>
            </div>
            <MetaMaskButton
                disabled={!agreed}
                className={css({
                    height: '90px',
                    display: 'flex',
                    justifyContent: 'center',
                })}
            />
        </ModalBase>
    );
};

export default MetamaskModal;
