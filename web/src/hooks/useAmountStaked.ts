import BigDecimal from 'js-big-decimal';
import React from 'react';
import useWeb3 from '../contexts/Web3Context';
import { IMDStaking } from '../models/IMDStaking';

/**
 * Gets the balance of the given token
 * @param token the token to get the balance of
 * @returns a bigdecimal
 */
export function useAmountStaked(
    contract: IMDStaking | undefined,
    tokenAddress?: string
): BigDecimal {
    const [balance, setBalance] = React.useState<BigDecimal>(new BigDecimal(0));
    const { accounts } = useWeb3();

    const refresh = React.useCallback(() => {
        if (!accounts[0] || !contract || !tokenAddress) return;

        contract.methods
            .totalStakedFor(accounts[0], tokenAddress)
            .call()
            .then((val) => setBalance(new BigDecimal(val)));
    }, [accounts, contract, tokenAddress]);

    React.useEffect(() => refresh(), [refresh]);

    return balance;
}

export default useAmountStaked;
