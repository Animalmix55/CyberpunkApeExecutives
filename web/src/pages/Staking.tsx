import React from 'react';
import { useStyletron } from 'styletron-react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import StakingControlBar, { Mode } from '../molecules/StakingControlBar';
import { useContractContext } from '../contexts/ContractContext';
import useWeb3 from '../contexts/Web3Context';
import useHeldTokens from '../hooks/useHeldTokens';
import useStakedTokens from '../hooks/useStakedTokens';
import { MetamaskModal } from '../molecules/MetamaskModal';
import TokenGrid from '../molecules/TokenGrid';
import { MOBILE } from '../utilties/MediaQueries';
import { useThemeContext } from '../contexts/ThemeContext';
import { InvalidChainModal } from '../molecules/InvalidChainModal';
import {
    StakingTokenProvider,
    useStakingToken,
} from '../contexts/StakingTokenContext';

const StakingInner = (): JSX.Element => {
    const { tokenAddress, tokenContract } = useStakingToken();
    const [selectedTokens, setSelectedTokens] = React.useState<number[]>([]);
    const { stakingContract } = useContractContext();
    const [stakingMode, setStakingMode] = React.useState<Mode>('Stake');
    const { accounts } = useWeb3();
    const theme = useThemeContext();

    React.useEffect(() => {
        setSelectedTokens([]);
    }, [stakingMode]);

    const [css] = useStyletron();
    const { ids: heldIds, loading: heldIdsLoading } =
        useHeldTokens(tokenContract);
    const { ids: stakedIds, loading: stakedIdsLoading } = useStakedTokens(
        stakingContract,
        tokenAddress
    );

    if (!accounts[0]) return <MetamaskModal />;

    return (
        <div
            className={css({
                paddingTop: '130px',
                [MOBILE]: {
                    paddingTop: '40px',
                },
            })}
        >
            <InvalidChainModal />
            <StakingControlBar
                setSelectedIds={setSelectedTokens}
                selectedIds={selectedTokens}
                setMode={setStakingMode}
                mode={stakingMode}
            />
            <h1
                className={css({
                    marginLeft: '30px',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                {stakingMode}
            </h1>
            {((heldIdsLoading && stakingMode === 'Stake') ||
                (stakingMode === 'Unstake' && stakedIdsLoading)) && (
                <Spinner
                    className={css({ margin: 'auto' })}
                    size={SpinnerSize.large}
                />
            )}
            <TokenGrid
                className={css({
                    display:
                        stakingMode === 'Stake' && !heldIdsLoading
                            ? 'flex'
                            : 'none',
                })}
                selectedTokens={selectedTokens}
                onChange={setSelectedTokens}
                tokens={heldIds}
                contract={tokenContract}
            />
            <TokenGrid
                className={css({
                    display:
                        stakingMode === 'Unstake' && !stakedIdsLoading
                            ? 'flex'
                            : 'none',
                })}
                selectedTokens={selectedTokens}
                onChange={setSelectedTokens}
                tokens={stakedIds}
                contract={tokenContract}
            />
        </div>
    );
};

export const Staking = (): JSX.Element => (
    <StakingTokenProvider>
        <StakingInner />
    </StakingTokenProvider>
);

export default Staking;
