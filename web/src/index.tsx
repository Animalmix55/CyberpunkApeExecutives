import { initializeIcons } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { HashRouter } from 'react-router-dom';
import { ScrollingProvider } from 'react-scroll-section';
import { ContractContextProvider } from './contexts/ContractContext';
import { CyberpunkApesContextProvider } from './contexts/CyberpunkApesContext';
import { SessionContextProvider } from './contexts/SessionContext';
import { defaultTheme, ThemeContextProvider } from './contexts/ThemeContext';
import { TransactionContextProvider } from './contexts/TransactionContext';
import 'react-toastify/dist/ReactToastify.css';
import { Chain } from './hooks/useWeb3';
import './styles/global.css';
import ApeRouter from './routing/ApeRouter';
import Header from './molecules/Header/Header';
import Footer from './sections/Footer';
import { Web3ContextProvider } from './contexts/Web3Context';

initializeIcons();

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
                                            api: 'http://localhost',
                                            etherscanUrl: '',
                                            chainId: Chain.Test,
                                            stakingContractAddress:
                                                '0x1731fCB9F541560Bf2c0bd0Ac28f1fF44eC0fAd2',
                                            tokenContractAddress:
                                                '0xA5216Fc347269aF60B0d6237d647743c6456520A',
                                            discordUrl:
                                                'https://discord.gg/UUaSqahHZw',
                                            twitterUrl:
                                                'https://twitter.com/ApeExecutives',
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
