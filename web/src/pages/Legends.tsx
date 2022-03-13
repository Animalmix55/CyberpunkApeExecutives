import React from 'react';
import { useStyletron } from 'styletron-react';
import { UnmintedLegendContextProvider } from '../contexts/UnmintedLegendContext';
import useWeb3 from '../contexts/Web3Context';
import LegendsControlBar from '../molecules/LegendsControlBar';
import MetamaskModal from '../molecules/MetamaskModal';
import { UnmintedLegendsGrid } from '../molecules/TokenGrid';
import { MOBILE } from '../utilties/MediaQueries';

export const LegendsPage = (): JSX.Element => {
    const [css] = useStyletron();

    const { accounts } = useWeb3();
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

    if (!accounts[0]) return <MetamaskModal />;

    return (
        <UnmintedLegendContextProvider>
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
                <LegendsControlBar
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                />
                <UnmintedLegendsGrid
                    selectedTokens={selectedIds}
                    onChange={setSelectedIds}
                />
            </div>
        </UnmintedLegendContextProvider>
    );
};

export default LegendsPage;
