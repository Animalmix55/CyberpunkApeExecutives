import { Modal } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useWeb3, { Chain } from '../contexts/Web3Context';

export const InvalidChainModalInner = ({
    desiredChain,
}: {
    desiredChain: Chain;
}): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

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
            <h1
                className={css({
                    textAlign: 'center',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                Connected to the Wrong Chain
            </h1>
            <h2 className={css({ textAlign: 'center' })}>
                Connect to {desiredChain}
            </h2>
        </div>
    );
};

export const InvalidChainModal = (): JSX.Element => {
    const theme = useThemeContext();
    const { chainId: expectedChainId } = useCyberpunkApesContext();
    const { chainId } = useWeb3();

    const isOpen = React.useMemo(
        () => chainId !== expectedChainId,
        [chainId, expectedChainId]
    );

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
            <InvalidChainModalInner
                desiredChain={Chain[expectedChainId] as never}
            />
        </Modal>
    );
};
