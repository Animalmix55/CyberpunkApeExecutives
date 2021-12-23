import React from 'react';
import useWeb3 from '../contexts/Web3Context';
import { IMDStaking } from '../models/IMDStaking';

export const useStakedTokens = (
    stakingContract?: IMDStaking,
    tokenAddress?: string
): { update: () => void; ids: number[] } => {
    const { accounts } = useWeb3();
    const [ids, setIds] = React.useState<number[]>([]);

    const update = React.useCallback(() => {
        if (!stakingContract || !tokenAddress || !accounts[0]) return;

        stakingContract.methods
            .stakedTokenIds(accounts[0], tokenAddress)
            .call()
            .then((v) => setIds(v.map(Number)));
    }, [accounts, stakingContract, tokenAddress]);

    React.useEffect(update, [update]);

    return { update, ids };
};

export default useStakedTokens;
