import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../contexts/ContractContext';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useWeb3 from '../contexts/Web3Context';
import useBalance from '../hooks/useBalance';
import { CyberpunkApeExecutives } from '../models/CyberpunkApeExecutives';
import { ButtonType } from './Button';
import TransactionButton from './TransactionButton';

interface Props {
    selectedIds: number[];
    setSelectedIds: (ids: number[]) => void;
    contract?: CyberpunkApeExecutives;
}

export const StakingControlBar = (props: Props): JSX.Element => {
    const { contract, selectedIds, setSelectedIds } = props;
    const { stakingContractAddress, tokenContractAddress } =
        useCyberpunkApesContext();
    const { stakingContract } = useContractContext();
    const { reload } = useWeb3();

    const staked = useBalance(contract, stakingContractAddress);
    const [css] = useStyletron();
    const theme = useThemeContext();
    const onStaked = (): void => {
        setSelectedIds([]);
        reload();
    };

    const stakingButtonClassName = css({
        borderRadius: '10px',
        margin: '10px',
        paddingLeft: '20px',
        paddingRight: '20px',
    });

    return (
        <div
            className={css({
                color: theme.fontColors.normal.primary.getCSSColor(1),
                width: '100%',
                display: 'flex',
            })}
        >
            <div
                className={css({
                    backgroundColor:
                        theme.lighterBackgroundColor.getCSSColor(0.7),
                    borderRadius: '10px',
                    flex: 1,
                    marginLeft: '30px',
                    marginRight: '30px',
                    display: 'flex',
                })}
            >
                <div
                    className={css({
                        margin: '10px auto 10px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    })}
                >
                    <h2
                        className={css({
                            color: theme.fontColors.normal.secondary.getCSSColor(
                                1
                            ),
                            margin: '0px 0px 10px 0px',
                        })}
                    >
                        Total Staked:
                    </h2>
                    <div>{staked.floor().getValue()} APE</div>
                </div>
                {selectedIds.length > 1 && (
                    <TransactionButton
                        contract={stakingContract}
                        method="stakeMany"
                        buttonType={ButtonType.primary}
                        className={stakingButtonClassName}
                        params={[tokenContractAddress, selectedIds]}
                        onTransact={(v): Promise<void> => v.then(onStaked)}
                    >
                        Stake
                    </TransactionButton>
                )}
                {selectedIds.length <= 1 && (
                    <TransactionButton
                        contract={stakingContract}
                        method="stake"
                        buttonType={ButtonType.primary}
                        params={[tokenContractAddress, selectedIds[0]]}
                        disabled={selectedIds.length === 0}
                        className={stakingButtonClassName}
                        onTransact={(v): Promise<void> => v.then(onStaked)}
                    >
                        Stake
                    </TransactionButton>
                )}
            </div>
        </div>
    );
};

export default StakingControlBar;
