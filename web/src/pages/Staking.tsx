import React from 'react';
import { useStyletron } from 'styletron-react';
import StakingControlBar from '../atoms/StakingControlBar';
import { useContractContext } from '../contexts/ContractContext';
import useHeldTokens from '../hooks/useHeldTokens';
import TokenGrid from '../molecules/TokenGrid';
import { MOBILE } from '../utilties/MediaQueries';

export const Staking = (): JSX.Element => {
    const [selectedTokens, setSelectedTokens] = React.useState<number[]>([]);
    const { tokenContract } = useContractContext();

    const [css] = useStyletron();
    const { ids } = useHeldTokens(tokenContract);

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
                contract={tokenContract}
            />
            <TokenGrid
                selectedTokens={selectedTokens}
                onChange={setSelectedTokens}
                tokens={ids}
                contract={tokenContract}
            />
        </div>
    );
};

export default Staking;
