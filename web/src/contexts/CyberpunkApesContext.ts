import React from 'react';
import { Chain } from '../hooks/useWeb3';

export interface CyberpunkApesContextType {
    api: string;
    chainId: Chain;
    discordUrl: string;
    twitterUrl: string;
}

const CyberpunkApesContext = React.createContext<CyberpunkApesContextType>({
    api: 'http://localhost',
    chainId: Chain.Test,
    discordUrl: '',
    twitterUrl: '',
});

export const useCyberpunkApesContext = (): CyberpunkApesContextType =>
    React.useContext(CyberpunkApesContext);

export const CyberpunkApesContextProvider = CyberpunkApesContext.Provider;

export default CyberpunkApesContext;
