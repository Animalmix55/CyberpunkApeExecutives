import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../../../contexts/ContractContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import useWeb3 from '../../../contexts/Web3Context';
import useBalance from '../../../hooks/useBalance';
import Tooltip from '../../Tooltip';
import BaseWidget from '../BaseWidget';

interface Props {
    className?: string;
}

export const LegendsBalanceWidget = (props: Props): JSX.Element => {
    const { className } = props;

    const { accounts } = useWeb3();
    const { legendsContract } = useContractContext();

    const myHoldings = useBalance(legendsContract, accounts[0]);
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
                Legend Holdings
            </h2>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <span>{myHoldings.floor().getValue()} LEGEND</span>
                <Tooltip
                    className={css({
                        fontSize: '12px',
                        marginLeft: '5px',
                    })}
                    text="The legends that you hold."
                />
            </div>
        </BaseWidget>
    );
};

export default LegendsBalanceWidget;
