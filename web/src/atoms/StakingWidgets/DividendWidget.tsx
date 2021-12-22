import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../../contexts/ContractContext';
import { useCyberpunkApesContext } from '../../contexts/CyberpunkApesContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import useDividend from '../../hooks/useDividend';
import { roundAndDisplay } from '../../utilties/Numbers';
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
                    text="The number of dividend tokens claimable by you."
                />
            </div>
        </BaseWidget>
    );
};

export default DividendWidget;
