import React from 'react';
import { IERC721Metadata } from '../models/IERC721Metadata';
import useWeb3 from '../contexts/Web3Context';

export const useHeldTokens = (
    contract?: IERC721Metadata
): { update: () => void; ids: number[] } => {
    const [transfersIn, setTransfersIn] = React.useState<
        Record<string, number>
    >({});
    const [transfersOut, setTransfersOut] = React.useState<
        Record<string, number>
    >({});

    const ids = React.useMemo<number[]>((): number[] => {
        const ownedIds: number[] = [];

        Object.keys(transfersIn).forEach((tokenId) => {
            if ((transfersOut[tokenId] || 0) > transfersIn[tokenId]) return;
            ownedIds.push(Number(tokenId));
        });

        return ownedIds;
    }, [transfersIn, transfersOut]);
    const { accounts } = useWeb3();

    const update = React.useCallback(() => {
        if (!contract) return;
        let firstIn = true;
        let firstOut = true;

        contract.events.Transfer(
            { filter: { to: accounts[0] }, fromBlock: 0 },
            (_, res) => {
                const { returnValues, blockNumber } = res;
                const { tokenId } = returnValues;

                setTransfersIn((ti) => {
                    const data = {
                        ...(!firstIn && ti),
                        [tokenId]: blockNumber,
                    };

                    firstIn = false;
                    return data;
                });
            }
        );

        contract.events.Transfer(
            { filter: { from: accounts[0] }, fromBlock: 0 },
            (_, res) => {
                const { returnValues, blockNumber } = res;
                const { tokenId } = returnValues;

                setTransfersOut((ti) => {
                    const data = {
                        ...(!firstOut && ti),
                        [tokenId]: blockNumber,
                    };

                    firstOut = false;
                    return data;
                });
            }
        );
    }, [accounts, contract]);

    React.useEffect(update, [update]);

    return { update, ids };
};

export default useHeldTokens;
