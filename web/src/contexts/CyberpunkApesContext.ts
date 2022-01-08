import React from 'react';
import { Chain } from './Web3Context';

export interface CyberpunkApesContextType {
    api: string;
    chainId: Chain;
    tokenContractAddress: string;
    stakingContractAddress: string;
    discordUrl: string;
    twitterUrl: string;
    etherscanUrl: string;
    genesisUrl: string;
    bootlegUrl: string;
}

const CyberpunkApesContext = React.createContext<CyberpunkApesContextType>({
    api: 'http://localhost',
    chainId: Chain.Test,
    tokenContractAddress: '',
    stakingContractAddress: '',
    etherscanUrl: '',
    discordUrl: '',
    twitterUrl: '',
    genesisUrl: '',
    bootlegUrl: '',
});

export const useCyberpunkApesContext = (): CyberpunkApesContextType =>
    React.useContext(CyberpunkApesContext);

export const CyberpunkApesContextProvider = CyberpunkApesContext.Provider;

export default CyberpunkApesContext;
