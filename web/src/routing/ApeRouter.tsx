import React from 'react';
import { Route, Switch } from 'react-router';
import { useStyletron } from 'styletron-react';
import MainPage from '../pages/Main';
import StakingPage from '../pages/Staking';

export enum Page {
    Main = '/',
    Staking = '/staking',
}

export const ApeRouter = (): JSX.Element => {
    const [css] = useStyletron();

    return (
        <div
            className={css({
                backgroundColor: 'black',
                minHeight: '100vh',
            })}
        >
            <Switch>
                <Route path={Page.Main} exact component={MainPage} />
                <Route path={Page.Staking} exact component={StakingPage} />
            </Switch>
        </div>
    );
};

export default ApeRouter;
