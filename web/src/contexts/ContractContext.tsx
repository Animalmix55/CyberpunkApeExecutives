import React from 'react';
import stakingAbi from '../assets/stakingAbi.json';
import tokenAbi from '../assets/tokenAbi.json';
import legendsAbi from '../assets/legendsAbi.json';
import rewardTokenAbi from '../assets/rewardTokenAbi.json';
import { IMDStaking } from '../models/IMDStaking';
import { CyberpunkApeExecutives } from '../models/CyberpunkApeExecutives';
import { useCyberpunkApesContext } from './CyberpunkApesContext';
import useWeb3 from './Web3Context';
import { ERC20 } from '../models/ERC20';
import { CollegeCredit } from '../models/CollegeCredit';
import { CyberpunkApeLegends } from '../models/CyberpunkApeLegends';

export interface ContractContextType {
    tokenContract?: CyberpunkApeExecutives;
    legendsContract?: CyberpunkApeLegends;
    stakingContract?: IMDStaking;
    rewardTokenContract?: ERC20;
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

    const {
        stakingContractAddress,
        lengendsContractAddress,
        creditContractAddress,
        tokenContractAddress,
    } = useCyberpunkApesContext();

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

    const legendsContract = React.useMemo(() => {
        if (!lengendsContractAddress) return undefined;
        if (!web3) return undefined;

        const token = new web3.eth.Contract(
            legendsAbi as never,
            lengendsContractAddress
        ) as unknown as CyberpunkApeLegends;
        return token;
    }, [lengendsContractAddress, web3]);

    const rewardTokenContract = React.useMemo(() => {
        if (!creditContractAddress || !web3) return undefined;
        return new web3.eth.Contract(
            rewardTokenAbi as never,
            creditContractAddress
        ) as unknown as CollegeCredit;
    }, [creditContractAddress, web3]);

    return (
        <ContractContext.Provider
            value={{
                stakingContract,
                tokenContract,
                rewardTokenContract,
                legendsContract,
            }}
        >
            {children}
        </ContractContext.Provider>
    );
};
