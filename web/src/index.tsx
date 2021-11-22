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
import Main from './pages/Main';

initializeIcons();

const styletron = new Client();

const Root = (): JSX.Element => {
    return (
        <ScrollingProvider>
            <TransactionContextProvider>
                <Provider value={styletron}>
                    <ThemeContextProvider value={defaultTheme}>
                        <SessionContextProvider>
                            <HashRouter>
                                <CyberpunkApesContextProvider
                                    value={{
                                        api: 'http://localhost',
                                        chainId: Chain.Test,
                                        discordUrl:
                                            'https://discord.gg/UUaSqahHZw',
                                        twitterUrl:
                                            'https://twitter.com/ApeExecutives',
                                    }}
                                >
                                    <ContractContextProvider>
                                        <>
                                            <ToastContainer />
                                            <Main />
                                        </>
                                    </ContractContextProvider>
                                </CyberpunkApesContextProvider>
                            </HashRouter>
                        </SessionContextProvider>
                    </ThemeContextProvider>
                </Provider>
            </TransactionContextProvider>
        </ScrollingProvider>
    );
};

const container = document.getElementById('self-injecting-react-app');
ReactDOM.render(<Root />, container);
