import BigDecimal from 'js-big-decimal';
import React from 'react';
import useWeb3 from '../contexts/Web3Context';
import { IMDStaking } from '../models/IMDStaking';
import { BASE, ZERO } from '../utilties/Numbers';

/**
 * Gets the balance of the given token
 * @param token the token to get the balance of
 * @returns a bigdecimal
 */
export function useDividend(
    contract: IMDStaking | undefined,
    tokenAddress?: string
): BigDecimal {
    const [balance, setBalance] = React.useState<BigDecimal>(ZERO);
    const { accounts } = useWeb3();

    const refresh = React.useCallback(() => {
        if (!accounts[0] || !contract || !tokenAddress) return;

        contract.methods
            .dividendOf(accounts[0], tokenAddress)
            .call()
            .then((val) => setBalance(new BigDecimal(val).divide(BASE, 30)));
    }, [accounts, contract, tokenAddress]);

    React.useEffect(() => refresh(), [refresh]);

    return balance;
}

export default useDividend;
