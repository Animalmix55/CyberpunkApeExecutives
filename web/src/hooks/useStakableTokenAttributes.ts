import BigDecimal from 'js-big-decimal';
import React from 'react';
import useWeb3 from '../contexts/Web3Context';
import { IMDStaking } from '../models/IMDStaking';
import { BASE, ZERO } from '../utilties/Numbers';

interface Output {
    minYield: BigDecimal;
    maxYield: BigDecimal;
    step: BigDecimal;
    yieldPeriod: number;
}

/**
 * Gets the attributes for a given stakable token
 * @param token the token to get the accrual rate for
 * @returns a bigdecimal
 */
export function useStakableTokenAttributes(
    contract: IMDStaking | undefined,
    tokenAddress?: string
): Output {
    const [tokenAttributes, setTokenAttributes] = React.useState<Output>({
        minYield: ZERO,
        maxYield: ZERO,
        step: ZERO,
        yieldPeriod: 0,
    });
    const { accounts } = useWeb3();

    const refresh = React.useCallback(() => {
        if (!accounts[0] || !contract || !tokenAddress) return;

        contract.methods
            .stakableTokenAttributes(tokenAddress)
            .call()
            .then((val) =>
                setTokenAttributes({
                    minYield: new BigDecimal(val.minYield).divide(BASE, 30),
                    maxYield: new BigDecimal(val.maxYield).divide(BASE, 30),
                    step: new BigDecimal(val.step).divide(BASE, 30),
                    yieldPeriod: Number(val.yieldPeriod),
                })
            );
    }, [accounts, contract, tokenAddress]);

    React.useEffect(() => refresh(), [refresh]);

    return tokenAttributes;
}

export default useStakableTokenAttributes;
