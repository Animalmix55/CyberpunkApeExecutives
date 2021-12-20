import React from 'react';
import abi from '../assets/stakingAbi.json';
import { IMDStaking } from '../models/IMDStaking';
import { useCyberpunkApesContext } from './CyberpunkApesContext';
import useWeb3 from './Web3Context';

export interface ContractContextType {
    tokenContract?: undefined;
    stakingContract?: IMDStaking;
}

const ContractContext = React.createContext<ContractContextType>({});

export const useContractContext = (): ContractContextType =>
    React.useContext(ContractContext);

export const ContractContextProvider = ({
    children,
}: {
    children: React.ReactChild;
}): JSX.Element => {
    const { web3 } = useWeb3();
    const { stakingContractAddress } = useCyberpunkApesContext();

    const stakingContract = React.useMemo(() => {
        if (!stakingContractAddress) return undefined;
        if (!web3) return undefined;

        const staking = new web3.eth.Contract(
            abi as never,
            stakingContractAddress
        ) as unknown as IMDStaking;
        return staking;
    }, [stakingContractAddress, web3]);

    return (
        <ContractContext.Provider
            value={{ stakingContract, tokenContract: undefined }}
        >
            {children}
        </ContractContext.Provider>
    );
};
