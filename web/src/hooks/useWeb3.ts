import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import Web3 from 'web3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: { ethereum: any; location: Location };

interface HookResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider: any | undefined;
    accounts: string[];
    chainId: number | undefined;
    web3?: Web3;
}

export enum Chain {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Test = 1337,
}

export const useWeb3 = (): HookResponse => {
    const [accounts, setAccounts] = React.useState([]);
    const [chainId, setChainId] = React.useState<Chain>();
    const [web3, setWeb3] = React.useState<Web3>();

    React.useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (window.ethereum.isConnected) setWeb3(new Web3(window.ethereum));

            const onConnected = (): void => setWeb3(new Web3(window.ethereum));
            const onDisconnected = (): void => setWeb3(undefined);

            window.ethereum.on('connect', onConnected);
            window.ethereum.on('disconnect', onDisconnected);

            return (): void => {
                window.ethereum.off('connect', onConnected);
                window.ethereum.off('disconnect', onDisconnected);
            };
        }

        return undefined;
    }, []);

    // eslint-disable-next-line consistent-return
    React.useEffect((): (() => void) | undefined => {
        const handleNewAccounts = (newAccounts: string[]): void => {
            setAccounts(newAccounts);
        };
        const handleChainChange = (newChain: string): void => {
            setChainId((cur) => {
                if (cur !== undefined && cur !== Number(newChain))
                    window.location.reload();
                return Number(newChain);
            });
        };

        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            const { ethereum } = window;
            ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(handleNewAccounts);
            ethereum.request({ method: 'eth_chainId' }).then(handleChainChange);
            ethereum.on('chainChanged', handleChainChange);
            ethereum.on('accountsChanged', handleNewAccounts);
            return (): void => {
                ethereum.off('chainChanged', handleChainChange);
                ethereum.off('accountsChanged', handleNewAccounts);
            };
        }
    }, []);

    return {
        accounts,
        provider: window.ethereum,
        chainId,
        web3,
    };
};

export default useWeb3;
