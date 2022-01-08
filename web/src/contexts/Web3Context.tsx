import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

export enum Chain {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Test = 1337,
}

export interface Web3ContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider?: any;
    accounts: string[];
    chainId?: number;
    web3?: Web3;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reload: () => Promise<any>;
    login: () => Promise<string[]>;
}

const Web3Context = React.createContext<Web3ContextType>({
    reload: () => Promise.resolve(undefined),
    login: () => Promise.resolve([]),
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [provider, _setProvider] = React.useState<any>();
    const web3 = React.useMemo(() => new Web3(provider as never), [provider]);
    const onboarding = React.useRef<MetaMaskOnboarding>();

    React.useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    const login = React.useCallback(async (): Promise<string[]> => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            const promise = provider.request({ method: 'eth_requestAccounts' });

            promise.then(setAccounts);
            return promise;
        }
        onboarding.current.startOnboarding();
        return Promise.resolve([] as string[]);
    }, [provider]);

    const reload = React.useCallback(async () => {
        const provider = await detectEthereumProvider();
        _setProvider(provider);

        return provider;
    }, []);

    React.useEffect(() => {
        reload();
    }, [reload]);

    // eslint-disable-next-line consistent-return
    React.useEffect((): (() => void) | undefined => {
        const handleNewAccounts = (newAccounts: string[]): void => {
            setAccounts(newAccounts);
        };
        const handleChainChange = (newChain: string): void => {
            setChainId(Number(newChain));
        };

        if (provider) {
            provider.request({ method: 'eth_chainId' }).then(handleChainChange);
            provider.on('chainChanged', handleChainChange);
            provider.on('accountsChanged', handleNewAccounts);
            return (): void => {
                provider.off('chainChanged', handleChainChange);
                provider.off('accountsChanged', handleNewAccounts);
            };
        }
    }, [provider]);

    return (
        <Web3Context.Provider
            value={{
                web3,
                reload,
                accounts,
                chainId,
                provider,
                login,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

export default useWeb3;
