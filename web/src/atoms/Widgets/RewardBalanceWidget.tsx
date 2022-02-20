import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../../contexts/ContractContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import useWeb3 from '../../contexts/Web3Context';
import useBalance from '../../hooks/useBalance';
import { roundAndDisplay } from '../../utilties/Numbers';
import Tooltip from '../Tooltip';
import BaseWidget from './BaseWidget';

interface Props {
    className?: string;
}

export const RewardBalanceWidget = (props: Props): JSX.Element => {
    const { className } = props;

    const { rewardTokenContract } = useContractContext();
    const { accounts } = useWeb3();

    const balance = useBalance(rewardTokenContract, accounts[0]);
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <BaseWidget className={className}>
            <h2
                className={css({
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                    margin: '0px 0px 10px 0px',
                })}
            >
                My Reward Balance
            </h2>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <span>{roundAndDisplay(balance)} $CREDIT</span>
                <Tooltip
                    className={css({
                        fontSize: '12px',
                        marginLeft: '5px',
                    })}
                    text="The current reward balance in your wallet (doesn't include unclaimed rewards)."
                />
            </div>
        </BaseWidget>
    );
};

export default RewardBalanceWidget;
