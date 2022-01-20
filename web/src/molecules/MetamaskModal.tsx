import { Checkbox, Modal } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import MetaMaskButton from '../atoms/MetamaskButton';
import { useThemeContext } from '../contexts/ThemeContext';
import useWeb3 from '../contexts/Web3Context';
import Terms from '../assets/Cyberpunk Ape Executives Terms of Use - 1.6.22.pdf';
import { MOBILE } from '../utilties/MediaQueries';

export const MetamaskModalInner = (): JSX.Element => {
    const [css] = useStyletron();
    const [agreed, setAgreed] = React.useState(false);
    const theme = useThemeContext();

    return (
        <div
            className={css({
                minWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                [MOBILE]: {
                    minWidth: 'unset',
                },
            })}
        >
            <h1 className={css({ textAlign: 'center' })}>Connect MetaMask</h1>
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
                        setAgreed(v);
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
        </div>
    );
};

export const MetamaskModal = (): JSX.Element => {
    const { accounts } = useWeb3();
    const theme = useThemeContext();

    const isOpen = React.useMemo(() => !accounts[0], [accounts]);

    return (
        <Modal
            isOpen={isOpen}
            styles={{
                main: {
                    borderRadius: '10px',
                    padding: '10px',
                    color: theme.fontColors.normal.primary.getCSSColor(1),
                    backgroundColor:
                        theme.lighterBackgroundColor.getCSSColor(1),
                },
            }}
        >
            <MetamaskModalInner />
        </Modal>
    );
};
