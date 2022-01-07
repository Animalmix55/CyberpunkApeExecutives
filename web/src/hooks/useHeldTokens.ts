import React from 'react';
import { IERC721Metadata } from '../models/IERC721Metadata';
import useWeb3 from '../contexts/Web3Context';
import useBalance from './useBalance';
import { ZERO } from '../utilties/Numbers';

export const useHeldTokens = (
    contract?: IERC721Metadata
): { update: () => void; ids: number[] } => {
    const { accounts } = useWeb3();
    const [ids, setIds] = React.useState<number[]>([]);
    const balance = useBalance(contract, accounts[0]);

    const update = React.useCallback(() => {
        if (!contract || !accounts[0] || balance.compareTo(ZERO) === 0) {
            setIds([]);
            return;
        }

        const ids: { [id: string]: boolean } = {};

        contract.events.Transfer(
            { filter: { to: accounts[0] }, fromBlock: 0 },
            (_, res) => {
                const { returnValues } = res;
                const { tokenId } = returnValues;

                contract.methods
                    .ownerOf(tokenId)
                    .call()
                    .then((addr) => {
                        if (addr.toLowerCase() === accounts[0].toLowerCase())
                            ids[tokenId] = true;

                        const results = Object.keys(ids).length;
                        if (results === Number(balance.getValue()))
                            setIds(Object.keys(ids).map(Number));
                    });
            }
        );
    }, [accounts, balance, contract]);

    React.useEffect(update, [update]);

    return { update, ids };
};

export default useHeldTokens;
