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
import { SessionContextProvider } from './contexts/SessionContext';
import { defaultTheme, ThemeContextProvider } from './contexts/ThemeContext';
import { TransactionContextProvider } from './contexts/TransactionContext';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import ApeRouter from './routing/ApeRouter';
import Header from './molecules/Header/Header';
import Footer from './sections/Footer';
import { Web3ContextProvider } from './contexts/Web3Context';

initializeIcons();

const {
    api,
    etherscanUrl,
    chainId,
    stakingContractAddress,
    tokenContractAddress,
    discordUrl,
    twitterUrl,
} = { ...window } as unknown as CyberpunkApesContextType;

const styletron = new Client();

const Root = (): JSX.Element => {
    return (
        <Web3ContextProvider>
            <ScrollingProvider>
                <TransactionContextProvider>
                    <Provider value={styletron}>
                        <ThemeContextProvider value={defaultTheme}>
                            <SessionContextProvider>
                                <HashRouter>
                                    <CyberpunkApesContextProvider
                                        value={{
                                            api,
                                            etherscanUrl,
                                            chainId,
                                            stakingContractAddress,
                                            tokenContractAddress,
                                            discordUrl,
                                            twitterUrl,
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
                                </HashRouter>
                            </SessionContextProvider>
                        </ThemeContextProvider>
                    </Provider>
                </TransactionContextProvider>
            </ScrollingProvider>
        </Web3ContextProvider>
    );
};

const container = document.getElementById('self-injecting-react-app');
ReactDOM.render(<Root />, container);
