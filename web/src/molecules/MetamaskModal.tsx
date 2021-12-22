import { Modal } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import MetaMaskButton from '../atoms/MetamaskButton';
import { useThemeContext } from '../contexts/ThemeContext';
import useWeb3 from '../contexts/Web3Context';

export const MetamaskModalInner = (): JSX.Element => {
    const [css] = useStyletron();

    return (
        <div
            className={css({
                minWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            })}
        >
            <h1 className={css({ textAlign: 'center' })}>Connect MetaMask</h1>
            <MetaMaskButton className={css({ height: '90px' })} />
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
