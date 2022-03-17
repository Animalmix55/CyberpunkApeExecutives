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
import TotalStakedWidget from '../atoms/Widgets/StakingWidgets/TotalStakedWidget';
import MyStakeWidget from '../atoms/Widgets/StakingWidgets/MyStakeWidget';
import RewardBalanceWidget from '../atoms/Widgets/RewardBalanceWidget';
import { MOBILE } from '../utilties/MediaQueries';
import DividendWidget from '../atoms/Widgets/StakingWidgets/DividendWidget';
import ClaimDividendButton from './ClaimDividendButton';
import { useConfirmationContext } from '../contexts/ConfirmationPromptContext';
import { useStakingToken } from '../contexts/StakingTokenContext';
import StakingTokenWidget from '../atoms/Widgets/StakingWidgets/StakingTokenWidget';

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
    selectedIds: number[];
    onStaked?: () => void;
    onUnstaked?: () => void;
    mode: Mode;
}

const StakingButton = (props: StakingButtonProps): JSX.Element => {
    const {
        stakingContract,
        className,
        selectedIds,
        onStaked,
        mode,
        onUnstaked,
    } = props;

    const { stakingContractAddress } = useCyberpunkApesContext();
    const { tokenContract, tokenAddress, selectedOption } = useStakingToken();
    const { accounts } = useWeb3();

    const { approved, update } = useApproved(
        tokenContract,
        stakingContractAddress
    );

    const confirm = useConfirmationContext();

    const onTransact = React.useCallback(() => {
        if (mode === 'Stake') onStaked?.();
        if (mode === 'Unstake') onUnstaked?.();
    }, [mode, onStaked, onUnstaked]);

    if (!tokenContract || !tokenAddress || !selectedOption) return <></>;

    const { shortName } = selectedOption;

    if (!approved)
        return (
            <TransactionButton
                contract={tokenContract}
                method="setApprovalForAll"
                buttonType={ButtonType.primary}
                className={className}
                params={async (): Promise<[string, boolean]> => {
                    const response = await confirm(
                        'Heads Up',
                        `Approval gives our contract access to stake ${shortName}s on your behalf. After the approval transaction completes, you will need to click the Stake button to stake your ${shortName}s. This transaction DOES NOT stake any ${shortName}s.`,
                        'Continue',
                        'Go Back'
                    );
                    if (!response) throw new Error('Approval Canceled');
                    return [stakingContractAddress, true];
                }}
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
                    params={[tokenAddress, selectedIds]}
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
                    params={[tokenAddress, selectedIds[0]]}
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
    const { tokenAddress } = useStakingToken();
    const { stakingContract } = useContractContext();
    const { reload } = useWeb3();

    const [css] = useStyletron();
    const theme = useThemeContext();
    const onStaked = (): void => {
        setSelectedIds([]);
        setMode?.('Unstake');
        reload();
    };
    const onUnstaked = (): void => {
        setSelectedIds([]);
        setMode?.('Stake');
        reload();
    };

    if (!stakingContract) return <></>;

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
                <StakingTokenWidget
                    className={css({
                        margin: '10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
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
                        alignItems: 'center',
                        marginLeft: '10px',
                        flexGrow: 1,
                        flexWrap: 'wrap',
                    })}
                >
                    <Button
                        buttonType={ButtonType.clear}
                        onClick={(): void =>
                            setMode?.((m) =>
                                m === 'Stake' ? 'Unstake' : 'Stake'
                            )
                        }
                        className={css({ marginLeft: 'auto', height: '70px' })}
                    >
                        <Icon iconName="Switch" />
                    </Button>
                    {tokenAddress && (
                        <>
                            <StakingButton
                                stakingContract={stakingContract}
                                className={css({
                                    borderRadius: '10px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    height: '70px',
                                    margin: '10px',
                                })}
                                selectedIds={selectedIds}
                                onStaked={onStaked}
                                onUnstaked={onUnstaked}
                                mode={mode}
                            />
                            <ClaimDividendButton
                                stakingContract={stakingContract}
                                tokenContractAddress={tokenAddress}
                                className={css({
                                    margin: '10px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    height: '70px',
                                })}
                                unstakeIds={
                                    mode === 'Unstake' ? selectedIds : undefined
                                }
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StakingControlBar;
