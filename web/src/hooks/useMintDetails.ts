import React from 'react';
import BigDecimal from 'js-big-decimal';
import { useContractContext } from '../contexts/ContractContext';
import { BASE, ZERO } from '../utilties/Numbers';

interface PresaleMintDetails {
    mintPrice: BigDecimal;
    startDate: number;
    endDate: number;
    totalMinted: number;
    maxMinted: number;
}

interface PublicDetails {
    mintPrice: BigDecimal;
    startDate: number;
    maxPerTransaction: number;
}

export function useMintDetails(
    sale?: 'presale' | 'public'
): PublicDetails | PresaleMintDetails;
export function useMintDetails(sale: 'public'): PublicDetails;
export function useMintDetails(sale: undefined): PublicDetails;
export function useMintDetails(): PublicDetails;
export function useMintDetails(sale: 'presale'): PresaleMintDetails;

export function useMintDetails(
    sale?: 'presale' | 'public'
): PresaleMintDetails | PublicDetails {
    const { tokenContract: contract } = useContractContext();
    const [details, setDetails] = React.useState<
        PresaleMintDetails & PublicDetails
    >({
        mintPrice: ZERO,
        startDate: Infinity,
        endDate: Infinity,
        totalMinted: 0,
        maxMinted: 0,
        maxPerTransaction: 0,
    });

    React.useEffect(() => {
        if (!contract) return;

        if (sale === 'presale') {
            contract.methods
                .presaleMint()
                .call()
                .then((fm) => {
                    const {
                        mintPrice,
                        startDate,
                        endDate,
                        totalMinted,
                        maxMinted,
                    } = fm;
                    setDetails({
                        maxPerTransaction: 0,
                        mintPrice: new BigDecimal(mintPrice).divide(BASE, 30),
                        startDate: Number(startDate),
                        endDate: Number(endDate),
                        totalMinted: Number(totalMinted),
                        maxMinted: Number(maxMinted),
                    });
                });

            return;
        }

        contract.methods
            .publicMint()
            .call()
            .then((fm) => {
                const { mintPrice, startDate, maxPerTransaction } = fm;
                setDetails({
                    mintPrice: new BigDecimal(mintPrice).divide(BASE, 30),
                    startDate: Number(startDate),
                    maxPerTransaction: Number(maxPerTransaction),
                    endDate: 0,
                    totalMinted: 0,
                    maxMinted: 0,
                });
            });
    }, [contract, sale]);

    return details;
}

export default useMintDetails;
