import React from 'react';
import stakingAbi from '../assets/stakingAbi.json';
import tokenAbi from '../assets/tokenAbi.json';
import rewardTokenAbi from '../assets/rewardTokenAbi.json';
import { IMDStaking } from '../models/IMDStaking';
import { CyberpunkApeExecutives } from '../models/CyberpunkApeExecutives';
import { useCyberpunkApesContext } from './CyberpunkApesContext';
import useWeb3 from './Web3Context';
import { ERC20 } from '../models/ERC20';
import { CollegeCredit } from '../models/CollegeCredit';

export interface ContractContextType {
    tokenContract?: CyberpunkApeExecutives;
    stakingContract?: IMDStaking;
    rewardTokenContract?: ERC20;
    rewardTokenAddress?: string;
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
    const [rewardTokenAddress, setRewardTokenAddress] =
        React.useState<string>();
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

    React.useEffect(() => {
        if (!stakingContract) return;
        stakingContract.methods
            .rewardToken()
            .call()
            .then(setRewardTokenAddress)
            .catch(() => setRewardTokenAddress(undefined));
    }, [stakingContract]);

    const rewardTokenContract = React.useMemo(() => {
        if (!rewardTokenAddress || !web3) return undefined;
        return new web3.eth.Contract(
            rewardTokenAbi as never,
            rewardTokenAddress
        ) as unknown as CollegeCredit;
    }, [rewardTokenAddress, web3]);

    return (
        <ContractContext.Provider
            value={{
                stakingContract,
                tokenContract,
                rewardTokenContract,
                rewardTokenAddress,
            }}
        >
            {children}
        </ContractContext.Provider>
    );
};
