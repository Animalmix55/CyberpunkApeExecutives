import React from 'react';
import { Chain } from '../hooks/useWeb3';

export interface CyberpunkApesContextType {
    api: string;
    chainId: Chain;
    tokenContractAddress: string;
    stakingContractAddress: string;
    discordUrl: string;
    twitterUrl: string;
    etherscanUrl: string;
}

const CyberpunkApesContext = React.createContext<CyberpunkApesContextType>({
    api: 'http://localhost',
    chainId: Chain.Test,
    tokenContractAddress: '',
    stakingContractAddress: '',
    etherscanUrl: '',
    discordUrl: '',
    twitterUrl: '',
});

export const useCyberpunkApesContext = (): CyberpunkApesContextType =>
    React.useContext(CyberpunkApesContext);

export const CyberpunkApesContextProvider = CyberpunkApesContext.Provider;

export default CyberpunkApesContext;
