import BigDecimal from 'js-big-decimal';
import React from 'react';
import { CyberpunkApeExecutives } from '../models/CyberpunkApeExecutives';
import { BASE, ZERO } from '../utilties/Numbers';

/**
 * Gets mint price for the given token
 * @param token the token to get the balance of
 * @returns a bigdecimal
 */
export function useMintPrice(token?: CyberpunkApeExecutives): BigDecimal {
    const [mintPrice, setMintPrice] = React.useState<BigDecimal>(ZERO);

    const refresh = React.useCallback(() => {
        if (!token) return;

        token.methods
            .mintPrice()
            .call()
            .then((val) => setMintPrice(new BigDecimal(val).divide(BASE, 30)));
    }, [token]);

    React.useEffect(() => refresh(), [refresh]);

    return mintPrice;
}

export default useMintPrice;
