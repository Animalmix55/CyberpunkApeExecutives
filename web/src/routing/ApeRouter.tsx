import React from 'react';
import { Route, Switch } from 'react-router';
import { useStyletron } from 'styletron-react';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { StakingTokenProvider } from '../contexts/StakingTokenContext';
import LegendsPage from '../pages/Legends';
import MainPage from '../pages/Main';
import MintPage from '../pages/Mint';
import StakingPage from '../pages/Staking';
import { StatsPage } from '../pages/Stats';

export enum Page {
    Main = '/',
    Staking = '/staking',
    Mint = '/mint',
    Legends = '/legends',
    Stats = '/stats',
}

export const ApeRouter = (): JSX.Element => {
    const [css] = useStyletron();
    const {
        stakingContractAddress,
        tokenContractAddress,
        creditContractAddress,
        lengendsContractAddress,
    } = useCyberpunkApesContext();

    return (
        <div
            className={css({
                backgroundColor: 'black',
                minHeight: '100vh',
                overflow: 'hidden',
            })}
        >
            <Switch>
                <Route path={Page.Main} exact component={MainPage} />
                {stakingContractAddress && (
                    <StakingTokenProvider>
                        <Route
                            path={Page.Staking}
                            exact
                            component={StakingPage}
                        />
                    </StakingTokenProvider>
                )}
                {tokenContractAddress && (
                    <Route path={Page.Mint} exact component={MintPage} />
                )}
                {creditContractAddress && lengendsContractAddress && (
                    <Route path={Page.Legends} exact component={LegendsPage} />
                )}
                <Route path={Page.Stats} exact component={StatsPage} />
            </Switch>
        </div>
    );
};

export default ApeRouter;
