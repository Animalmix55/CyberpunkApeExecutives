import React from 'react';
import { useStyletron } from 'styletron-react';
import StakingControlBar, { Mode } from '../molecules/StakingControlBar';
import { useContractContext } from '../contexts/ContractContext';
import useWeb3 from '../contexts/Web3Context';
import useHeldTokens from '../hooks/useHeldTokens';
import useStakedTokens from '../hooks/useStakedTokens';
import { MetamaskModal } from '../molecules/MetamaskModal';
import TokenGrid from '../molecules/TokenGrid';
import { MOBILE } from '../utilties/MediaQueries';
import { useThemeContext } from '../contexts/ThemeContext';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';

export const Staking = (): JSX.Element => {
    const [selectedTokens, setSelectedTokens] = React.useState<number[]>([]);
    const { tokenContract, stakingContract } = useContractContext();
    const { tokenContractAddress } = useCyberpunkApesContext();
    const [stakingMode, setStakingMode] = React.useState<Mode>('Stake');
    const { accounts } = useWeb3();
    const theme = useThemeContext();

    React.useEffect(() => {
        setSelectedTokens([]);
    }, [stakingMode]);

    const [css] = useStyletron();
    const { ids: heldIds } = useHeldTokens(tokenContract);
    const { ids: stakedIds } = useStakedTokens(
        stakingContract,
        tokenContractAddress
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
            <TokenGrid
                className={css({
                    display: stakingMode === 'Stake' ? 'flex' : 'none',
                })}
                selectedTokens={selectedTokens}
                onChange={setSelectedTokens}
                tokens={heldIds}
                contract={tokenContract}
            />
            <TokenGrid
                className={css({
                    display: stakingMode === 'Unstake' ? 'flex' : 'none',
                })}
                selectedTokens={selectedTokens}
                onChange={setSelectedTokens}
                tokens={stakedIds}
                contract={tokenContract}
            />
        </div>
    );
};

export default Staking;
