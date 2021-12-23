import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../../contexts/ContractContext';
import { useCyberpunkApesContext } from '../../contexts/CyberpunkApesContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import useDividend from '../../hooks/useDividend';
import useStakableTokenAttributes from '../../hooks/useStakableTokenAttributes';
import { roundAndDisplay } from '../../utilties/Numbers';
import FormatTimeOffset from '../../utilties/TimeFormatter';
import Tooltip from '../Tooltip';
import BaseWidget from './BaseWidget';

interface Props {
    className?: string;
}

export const DividendWidget = (props: Props): JSX.Element => {
    const { className } = props;

    const { tokenContractAddress } = useCyberpunkApesContext();
    const { stakingContract } = useContractContext();

    const dividend = useDividend(stakingContract, tokenContractAddress);
    const [css] = useStyletron();
    const theme = useThemeContext();

    const { maxYield, minYield, step, yieldPeriod } =
        useStakableTokenAttributes(stakingContract, tokenContractAddress);

    return (
        <BaseWidget className={className}>
            <h2
                className={css({
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                    margin: '0px 0px 10px 0px',
                })}
            >
                Dividend
            </h2>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <span>{roundAndDisplay(dividend)} $CREDIT</span>
                <Tooltip
                    className={css({
                        fontSize: '12px',
                        marginLeft: '5px',
                    })}
                    text={
                        <div>
                            <h2
                                className={css({
                                    color: theme.fontColors.normal.secondary.getCSSColor(
                                        1
                                    ),
                                })}
                            >
                                Explanation
                            </h2>
                            The number of dividend tokens claimable by you.{' '}
                            Dividends are calculated per token based on the{' '}
                            duration staked.
                            <br />
                            <br />
                            Every {FormatTimeOffset(yieldPeriod)} since being{' '}
                            staked, a token earns tokens, starting at{' '}
                            {roundAndDisplay(minYield)} $CREDIT and maxing at{' '}
                            {roundAndDisplay(maxYield)} $CREDIT per period{' '}
                            increasing at a step size of {roundAndDisplay(step)}{' '}
                            $CREDIT per period.
                            <br />
                            <br />
                            <h2
                                className={css({
                                    color: theme.fontColors.normal.secondary.getCSSColor(
                                        1
                                    ),
                                })}
                            >
                                Example
                            </h2>
                            <div>
                                Staking 1 token today will yield{' '}
                                {roundAndDisplay(minYield)} $CREDIT after{' '}
                                {FormatTimeOffset(yieldPeriod)} $CREDIT. After{' '}
                                an additional {FormatTimeOffset(yieldPeriod)},{' '}
                                that token will yield another{' '}
                                {roundAndDisplay(minYield.add(step))} $CREDIT (
                                {roundAndDisplay(step)} $CREDIT more than the{' '}
                                previous yield). This increase will continue{' '}
                                until reaching a per-period yield of{' '}
                                {roundAndDisplay(maxYield)} $CREDIT per token{' '}
                                staked. At which point, you will yield{' '}
                                {roundAndDisplay(maxYield)} $CREDIT per token{' '}
                                per period as long as the token is staked.
                            </div>
                        </div>
                    }
                />
            </div>
        </BaseWidget>
    );
};

export default DividendWidget;
