import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import Web3 from 'web3';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: { ethereum: any; location: Location };

export enum Chain {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Test = 1337,
}

export interface Web3ContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider?: React.MutableRefObject<any>;
    accounts: string[];
    chainId?: number;
    web3?: Web3;
    reload: () => void;
}

const Web3Context = React.createContext<Web3ContextType>({
    reload: () => '',
    accounts: [],
});

export const useWeb3 = (): Web3ContextType => React.useContext(Web3Context);

export const Web3ContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [accounts, setAccounts] = React.useState<string[]>([]);
    const [chainId, setChainId] = React.useState<Chain>();
    const [web3, setWeb3] = React.useState<Web3>();
    const provider = React.useRef(window.ethereum);

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

    const web3Temp = React.useRef<Web3>();
    const reload = React.useCallback(() => {
        setWeb3((val) => {
            web3Temp.current = val;
            return undefined;
        });
    }, []);
    React.useEffect(() => {
        if (!web3 && web3Temp.current) {
            setWeb3(web3Temp.current);
            web3Temp.current = undefined;
        }
    }, [web3]);

    return (
        <Web3Context.Provider
            value={{
                web3,
                reload,
                accounts,
                chainId,
                provider,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

export default useWeb3;
