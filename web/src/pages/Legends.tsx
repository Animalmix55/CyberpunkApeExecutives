import React from 'react';
import { useStyletron } from 'styletron-react';
import LegendsControlBar from '../molecules/LegendsControlBar';
import { UnmintedLegendsGrid } from '../molecules/TokenGrid';
import { MOBILE } from '../utilties/MediaQueries';

export const LegendsPage = (): JSX.Element => {
    const [css] = useStyletron();

    return (
        <div
            className={css({
                paddingTop: '130px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                [MOBILE]: {
                    paddingTop: '40px',
                },
            })}
        >
            <LegendsControlBar />
            <UnmintedLegendsGrid
                selectedTokens={[]}
                onChange={(): void => void 0}
            />
        </div>
    );
};

export default LegendsPage;
