import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../../../contexts/ContractContext';
import { useCyberpunkApesContext } from '../../../contexts/CyberpunkApesContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import useAmountStaked from '../../../hooks/useAmountStaked';
import Tooltip from '../../Tooltip';
import BaseWidget from '../BaseWidget';

interface Props {
    className?: string;
}

export const MyStakeWidget = (props: Props): JSX.Element => {
    const { className } = props;

    const { tokenContractAddress } = useCyberpunkApesContext();
    const { stakingContract } = useContractContext();

    const myStake = useAmountStaked(stakingContract, tokenContractAddress);
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
                My Stake
            </h2>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <span>{myStake.floor().getValue()} APE</span>
                <Tooltip
                    className={css({
                        fontSize: '12px',
                        marginLeft: '5px',
                    })}
                    text="The number of tokens staked by you."
                />
            </div>
        </BaseWidget>
    );
};

export default MyStakeWidget;