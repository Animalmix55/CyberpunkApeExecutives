import React from 'react';
import { useStyletron } from 'styletron-react';
import { useCyberpunkApesContext } from '../../../contexts/CyberpunkApesContext';
import { useStakingToken } from '../../../contexts/StakingTokenContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import useBalance from '../../../hooks/useBalance';
import Tooltip from '../../Tooltip';
import BaseWidget from '../BaseWidget';

interface Props {
    className?: string;
}

export const TotalStakedWidget = (props: Props): JSX.Element => {
    const { className } = props;

    const { stakingContractAddress } = useCyberpunkApesContext();
    const { tokenContract, selectedOption } = useStakingToken();

    const totalStaked = useBalance(tokenContract, stakingContractAddress);
    const [css] = useStyletron();
    const theme = useThemeContext();

    if (!selectedOption || !tokenContract) return <></>;

    const { shortName } = selectedOption;

    return (
        <BaseWidget className={className}>
            <h2
                className={css({
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                    margin: '0px 0px 10px 0px',
                })}
            >
                Total Staked
            </h2>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <span>
                    {totalStaked.floor().getValue()} {shortName}
                </span>
                <Tooltip
                    className={css({
                        fontSize: '12px',
                        marginLeft: '5px',
                    })}
                    text="The number of tokens staked overall, by all users."
                />
            </div>
        </BaseWidget>
    );
};

export default TotalStakedWidget;
