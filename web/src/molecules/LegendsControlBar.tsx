import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../contexts/ThemeContext';
import RewardBalanceWidget from '../atoms/StakingWidgets/RewardBalanceWidget';
import { MOBILE } from '../utilties/MediaQueries';

export const LegendsControlBar = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();
    return (
        <div
            className={css({
                color: theme.fontColors.normal.primary.getCSSColor(1),
                width: '100%',
                display: 'flex',
            })}
        >
            <div
                className={css({
                    backgroundColor:
                        theme.lighterBackgroundColor.getCSSColor(0.7),
                    borderRadius: '10px',
                    flex: 1,
                    marginLeft: '30px',
                    margin: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                })}
            >
                <RewardBalanceWidget
                    className={css({
                        margin: '10px auto 10px 10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
            </div>
        </div>
    );
};

export default LegendsControlBar;
