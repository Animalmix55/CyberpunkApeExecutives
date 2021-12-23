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
                                            etherscanUrl:
                                                'https://ropsten.etherscan.io',
                                            chainId: Chain.Ropsten,
                                            stakingContractAddress:
                                                '0x14B0896e0f5ed8C2E2d44b2D29fda94Fbf9A320D',
                                            tokenContractAddress:
                                                '0xf0a40BC72091e29f56bb658a33391EB1D7d02973',
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
