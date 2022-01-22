import React from 'react';
import useWeb3 from '../contexts/Web3Context';
import { IMDStaking } from '../models/IMDStaking';

export const useStakedTokens = (
    stakingContract?: IMDStaking,
    tokenAddress?: string
): { update: () => void; ids: number[]; loading: boolean } => {
    const { accounts } = useWeb3();
    const [ids, setIds] = React.useState<number[]>([]);
    const [loading, setLoading] = React.useState(true);

    const update = React.useCallback(() => {
        setLoading(true);
        setIds([]);
        if (!stakingContract || !tokenAddress || !accounts[0]) {
            setLoading(false);
            return;
        }

        stakingContract.methods
            .stakedTokenIds(accounts[0], tokenAddress)
            .call()
            .then((v) => {
                setIds(v.map(Number));
                setLoading(false);
            });
    }, [accounts, stakingContract, tokenAddress]);

    React.useEffect(update, [update]);

    return { update, ids, loading };
};

export default useStakedTokens;
