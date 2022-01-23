import React from 'react';
import { useStyletron } from 'styletron-react';
import ModalBase from '../atoms/ModalBase';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useWeb3, { Chain } from '../contexts/Web3Context';

export const InvalidChainModal = (): JSX.Element => {
    const theme = useThemeContext();
    const { chainId: expectedChainId } = useCyberpunkApesContext();
    const { chainId } = useWeb3();
    const isOpen = React.useMemo(
        () => chainId !== expectedChainId,
        [chainId, expectedChainId]
    );
    const [css] = useStyletron();

    return (
        <ModalBase isOpen={isOpen}>
            <h1
                className={css({
                    textAlign: 'center',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                Connected to the Wrong Chain
            </h1>
            <div className={css({ maxWidth: '500px', textAlign: 'center' })}>
                You might be on the wrong chain, or be running two Web3
                providers simultaneously (ex: Coinbase Wallet and MetaMask)
            </div>
            <h2 className={css({ textAlign: 'center' })}>
                Connect to {Chain[expectedChainId]}
            </h2>
        </ModalBase>
    );
};

export default InvalidChainModal;
