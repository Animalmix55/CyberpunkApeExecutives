import React from 'react';
import stakingAbi from '../assets/stakingAbi.json';
import tokenAbi from '../assets/tokenAbi.json';
import { IMDStaking } from '../models/IMDStaking';
import { CyberpunkApeExecutives } from '../models/CyberpunkApeExecutives';
import { useCyberpunkApesContext } from './CyberpunkApesContext';
import useWeb3 from './Web3Context';

export interface ContractContextType {
    tokenContract?: CyberpunkApeExecutives;
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
    const { stakingContractAddress, tokenContractAddress } =
        useCyberpunkApesContext();

    const stakingContract = React.useMemo(() => {
        if (!stakingContractAddress) return undefined;
        if (!web3) return undefined;

        const staking = new web3.eth.Contract(
            stakingAbi as never,
            stakingContractAddress
        ) as unknown as IMDStaking;
        return staking;
    }, [stakingContractAddress, web3]);

    const tokenContract = React.useMemo(() => {
        if (!tokenContractAddress) return undefined;
        if (!web3) return undefined;

        const token = new web3.eth.Contract(
            tokenAbi as never,
            tokenContractAddress
        ) as unknown as CyberpunkApeExecutives;
        return token;
    }, [tokenContractAddress, web3]);

    return (
        <ContractContext.Provider value={{ stakingContract, tokenContract }}>
            {children}
        </ContractContext.Provider>
    );
};
