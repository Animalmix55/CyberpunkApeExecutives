import { initializeIcons } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { HashRouter } from 'react-router-dom';
import { ScrollingProvider } from 'react-scroll-section';
import { ContractContextProvider } from './contexts/ContractContext';
import {
    CyberpunkApesContextProvider,
    CyberpunkApesContextType,
} from './contexts/CyberpunkApesContext';
import { defaultTheme, ThemeContextProvider } from './contexts/ThemeContext';
import { TransactionContextProvider } from './contexts/TransactionContext';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import ApeRouter from './routing/ApeRouter';
import Header from './molecules/Header/Header';
import Footer from './sections/Footer';
import { Web3ContextProvider } from './contexts/Web3Context';
import { ConfirmationContextProvider } from './contexts/ConfirmationPromptContext';

initializeIcons();

const {
    api,
    etherscanUrl,
    chainId,
    stakingContractAddress,
    tokenContractAddress,
    discordUrl,
    twitterUrl,
    genesisUrl,
    bootlegUrl,
} = { ...window } as unknown as CyberpunkApesContextType;

const styletron = new Client();

const Root = (): JSX.Element => {
    return (
        <Web3ContextProvider>
            <ScrollingProvider>
                <TransactionContextProvider>
                    <Provider value={styletron}>
                        <ThemeContextProvider value={defaultTheme}>
                            <HashRouter>
                                <ConfirmationContextProvider>
                                    <CyberpunkApesContextProvider
                                        value={{
                                            api,
                                            etherscanUrl,
                                            chainId,
                                            stakingContractAddress,
                                            tokenContractAddress,
                                            discordUrl,
                                            twitterUrl,
                                            genesisUrl,
                                            bootlegUrl,
                                        }}
                                    >
                                        <ContractContextProvider>
                                            <>
                                                <Header />
                                                <ToastContainer position="bottom-left" />
                                                <ApeRouter />
                                                <Footer />
                                            </>
                                        </ContractContextProvider>
                                    </CyberpunkApesContextProvider>
                                </ConfirmationContextProvider>
                            </HashRouter>
                        </ThemeContextProvider>
                    </Provider>
                </TransactionContextProvider>
            </ScrollingProvider>
        </Web3ContextProvider>
    );
};

const container = document.getElementById('self-injecting-react-app');
ReactDOM.render(<Root />, container);
