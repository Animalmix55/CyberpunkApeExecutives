import React from 'react';
import { useStyletron } from 'styletron-react';
import useWeb3 from '../contexts/Web3Context';
import { InvalidChainModal } from '../molecules/InvalidChainModal';
import { MetamaskModal } from '../molecules/MetamaskModal';
import MintDock from '../molecules/MintDock';
import { MOBILE } from '../utilties/MediaQueries';

export const MintPage = (): JSX.Element => {
    const [css] = useStyletron();
    const { accounts } = useWeb3();

    if (!accounts[0]) return <MetamaskModal />;
    return (
        <div
            className={css({
                padding: '130px 30px 30px 30px',
                [MOBILE]: {
                    padding: '40px 30px 30px 30px',
                },
            })}
        >
            <InvalidChainModal />
            <MintDock />
        </div>
    );
};

export default MintPage;
