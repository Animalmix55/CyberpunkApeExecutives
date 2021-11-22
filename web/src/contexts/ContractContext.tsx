import React from 'react';
import { toast } from 'react-toastify';
import { getContractAddress } from '../api/Requests';
import abi from '../assets/abi.json';
import useCurrentTime from '../hooks/useCurrentTime';
import useSaleDates from '../hooks/useSaleDates';
import useWeb3 from '../hooks/useWeb3';
import { RooTroop } from '../models/RooTroop';
import { useCyberpunkApesContext } from './CyberpunkApesContext';
import { useSessionContext } from './SessionContext';

export interface ContractContextType {
    contract?: RooTroop;
}

const ContractContext = React.createContext<ContractContextType>({});

export const useContractContext = (): ContractContextType =>
    React.useContext(ContractContext);

export const ContractContextProvider = ({
    children,
}: {
    children: React.ReactChild;
}): JSX.Element => {
    const [contractAddress, setContractAddress] = React.useState<string>();
    const { web3 } = useWeb3();
    const { sessionToken } = useSessionContext();
    const { api } = useCyberpunkApesContext();

    const time = useCurrentTime();
    const dates = useSaleDates();

    const contract = React.useMemo(() => {
        if (!contractAddress) return undefined;
        if (!web3) return undefined;

        const rooTroop = new web3.eth.Contract(
            abi as never,
            contractAddress
        ) as unknown as RooTroop;
        return rooTroop;
    }, [contractAddress, web3]);

    const lastChecked = React.useRef<number>();
    React.useEffect(() => {
        const { presale, public: publicSale, free } = dates;

        // only every 5 seconds
        if (contractAddress) return;
        if (presale.start === 0 && free.start === 0 && publicSale.start === 0)
            return;
        if (lastChecked.current !== undefined && time - lastChecked.current < 5)
            return;

        if (
            presale.start <= time ||
            free.start <= time ||
            publicSale.start <= time
        ) {
            lastChecked.current = time;

            getContractAddress(api, sessionToken)
                .then(setContractAddress)
                .catch((e) => {
                    if (!String(e).includes('code 401'))
                        toast('Failed to fetch contract address', {
                            type: 'error',
                        });
                });
        }
    }, [api, contractAddress, dates, sessionToken, time]);

    return (
        <ContractContext.Provider value={{ contract }}>
            {children}
        </ContractContext.Provider>
    );
};
