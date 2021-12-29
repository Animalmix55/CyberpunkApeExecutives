import React from 'react';
import { Route, Switch } from 'react-router';
import { useStyletron } from 'styletron-react';
import MainPage from '../pages/Main';
import MintPage from '../pages/Mint';
import StakingPage from '../pages/Staking';

export enum Page {
    Main = '/',
    Staking = '/staking',
    Mint = '/mint',
}

export const ApeRouter = (): JSX.Element => {
    const [css] = useStyletron();

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
                <Route path={Page.Staking} exact component={StakingPage} />
                <Route path={Page.Mint} exact component={MintPage} />
            </Switch>
        </div>
    );
};

export default ApeRouter;
