import { Icon } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../contexts/ContractContext';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useWeb3 from '../contexts/Web3Context';
import useApproved from '../hooks/useApproved';
import { IMDStaking } from '../models/IMDStaking';
import Button, { ButtonType } from '../atoms/Button';
import TransactionButton from '../atoms/TransactionButton';
import TotalStakedWidget from '../atoms/StakingWidgets/TotalStakedWidget';
import MyStakeWidget from '../atoms/StakingWidgets/MyStakeWidget';
import RewardBalanceWidget from '../atoms/StakingWidgets/RewardBalanceWidget';
import { MOBILE } from '../utilties/MediaQueries';
import DividendWidget from '../atoms/StakingWidgets/DividendWidget';
import ClaimDividendButton from './ClaimDividendButton';

export type Mode = 'Stake' | 'Unstake';

interface Props {
    selectedIds: number[];
    setSelectedIds: (ids: number[]) => void;
    setMode?: React.Dispatch<React.SetStateAction<Mode>>;
    mode: Mode;
}

interface StakingButtonProps {
    stakingContract: IMDStaking;
    className?: string;
    tokenContractAddress?: string;
    selectedIds: number[];
    onStaked?: () => void;
    onUnstaked?: () => void;
    mode: Mode;
}

const StakingButton = (props: StakingButtonProps): JSX.Element => {
    const {
        stakingContract,
        className,
        tokenContractAddress,
        selectedIds,
        onStaked,
        mode,
        onUnstaked,
    } = props;

    const { stakingContractAddress } = useCyberpunkApesContext();
    const { tokenContract } = useContractContext();
    const { accounts } = useWeb3();

    const { approved, update } = useApproved(
        tokenContract,
        stakingContractAddress
    );

    const onTransact = React.useCallback(() => {
        if (mode === 'Stake') onStaked();
        if (mode === 'Unstake') onUnstaked();
    }, [mode, onStaked, onUnstaked]);

    if (!approved)
        return (
            <TransactionButton
                contract={tokenContract}
                method="setApprovalForAll"
                buttonType={ButtonType.primary}
                className={className}
                params={[stakingContractAddress, true]}
                onTransact={(v): Promise<void> => v.then(update)}
                tx={{ from: accounts[0] }}
            >
                Approve
            </TransactionButton>
        );

    return (
        <>
            {selectedIds.length > 1 && (
                <TransactionButton
                    contract={stakingContract}
                    method={mode === 'Stake' ? 'stakeMany' : 'unstakeMany'}
                    buttonType={ButtonType.primary}
                    className={className}
                    params={[tokenContractAddress, selectedIds]}
                    tx={{ from: accounts[0] }}
                    onTransact={(v): Promise<void> => v.then(onTransact)}
                >
                    {mode}
                </TransactionButton>
            )}
            {selectedIds.length <= 1 && (
                <TransactionButton
                    contract={stakingContract}
                    method={mode === 'Stake' ? 'stake' : 'unstake'}
                    buttonType={ButtonType.primary}
                    params={[tokenContractAddress, selectedIds[0]]}
                    disabled={selectedIds.length === 0}
                    tx={{ from: accounts[0] }}
                    className={className}
                    onTransact={(v): Promise<void> => v.then(onTransact)}
                >
                    {mode}
                </TransactionButton>
            )}
        </>
    );
};

export const StakingControlBar = (props: Props): JSX.Element => {
    const { selectedIds, setSelectedIds, mode, setMode } = props;
    const { tokenContractAddress } = useCyberpunkApesContext();
    const { stakingContract } = useContractContext();
    const { reload } = useWeb3();

    const [css] = useStyletron();
    const theme = useThemeContext();
    const onStaked = (): void => {
        setSelectedIds([]);
        setMode('Unstake');
        reload();
    };
    const onUnstaked = (): void => {
        setSelectedIds([]);
        setMode('Stake');
        reload();
    };

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
                    margin: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                })}
            >
                <TotalStakedWidget
                    className={css({
                        margin: '10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
                <MyStakeWidget
                    className={css({
                        margin: '10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
                <RewardBalanceWidget
                    className={css({
                        margin: '10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
                <DividendWidget
                    className={css({
                        margin: '10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
                <div
                    className={css({
                        display: 'flex',
                        alignItems: 'stretch',
                        minHeight: '70px',
                        marginLeft: '10px',
                        flexGrow: 1,
                    })}
                >
                    <Button
                        buttonType={ButtonType.clear}
                        onClick={(): void =>
                            setMode?.((m) =>
                                m === 'Stake' ? 'Unstake' : 'Stake'
                            )
                        }
                        className={css({ marginLeft: 'auto' })}
                    >
                        <Icon iconName="Switch" />
                    </Button>
                    <StakingButton
                        stakingContract={stakingContract}
                        className={css({
                            borderRadius: '10px',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            margin: '10px',
                        })}
                        tokenContractAddress={tokenContractAddress}
                        selectedIds={selectedIds}
                        onStaked={onStaked}
                        onUnstaked={onUnstaked}
                        mode={mode}
                    />
                    <ClaimDividendButton
                        stakingContract={stakingContract}
                        tokenContractAddress={tokenContractAddress}
                        className={css({
                            margin: '10px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                        })}
                        unstakeIds={mode === 'Unstake' && selectedIds}
                    />
                </div>
            </div>
        </div>
    );
};

export default StakingControlBar;