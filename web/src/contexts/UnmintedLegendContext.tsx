import BigDecimal from 'js-big-decimal';
import React from 'react';
import { BASE } from '../utilties/Numbers';
import { useContractContext } from './ContractContext';

export type UnmintedLegendContextType =
    | {
          ids: number[];
          prices: BigDecimal[];
      }
    | undefined;

export const UnmintedLegendContext =
    React.createContext<UnmintedLegendContextType>(undefined);

export const UnmintedLegendContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [result, setResult] = React.useState<UnmintedLegendContextType>();
    const { legendsContract } = useContractContext();

    React.useEffect(() => {
        setResult(undefined);
        if (!legendsContract) return;

        legendsContract.methods
            .unmintedTokens()
            .call()
            .then((res) => {
                const { 0: ids, 1: prices } = res;

                setResult({
                    ids: ids.map(Number),
                    prices: prices.map((p) =>
                        new BigDecimal(p).divide(BASE, 30)
                    ),
                });
            });
    }, [legendsContract]);

    return (
        <UnmintedLegendContext.Provider value={result}>
            {children}
        </UnmintedLegendContext.Provider>
    );
};

export const useUnmintedLegends = (): UnmintedLegendContextType =>
    React.useContext(UnmintedLegendContext);
