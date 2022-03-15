import { Spinner, SpinnerSize } from '@fluentui/react';
import BigDecimal from 'js-big-decimal';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useContractContext } from '../contexts/ContractContext';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useBalance from '../hooks/useBalance';
import { ClaimDividend, Staked, Unstaked } from '../models/IMDStaking';
import { MOBILE } from '../utilties/MediaQueries';
import { BASE, roundAndDisplay, ZERO } from '../utilties/Numbers';

interface Stats {
    claimableCredit?: BigDecimal;
    creditClaimed?: BigDecimal;
    stakers?: string[];
    dividends?: BigDecimal[];
}

const useStats = (token?: string): Stats => {
    const { stakingContract } = useContractContext();

    const [stakers, setStakers] = React.useState<string[]>();
    const [creditClaimed, setCreditClaimed] = React.useState<BigDecimal>();
    const [dividends, setDividends] = React.useState<BigDecimal[]>();
    const totalDividend = React.useMemo(
        () =>
            dividends?.reduce((prev, cur) => {
                return cur.add(prev);
            }, ZERO),
        [dividends]
    );

    React.useEffect(() => {
        if (!stakingContract || !token) {
            setStakers([]);
            return;
        }
        setStakers(undefined);

        const fetch = async (): Promise<void> => {
            const stakeEvents = (await stakingContract.getPastEvents('Staked', {
                fromBlock: 14007525,
                toBlock: 'latest',
                filter: { token },
            })) as unknown as Staked[];

            const unstakeEvents = (await stakingContract.getPastEvents(
                'Unstaked',
                {
                    fromBlock: 14007525,
                    toBlock: 'latest',
                }
            )) as unknown as Unstaked[];

            const joinedEvents = (
                stakeEvents.concat(unstakeEvents) as (Staked | Unstaked)[]
            ).sort((a, b) => a.blockNumber - b.blockNumber);

            const userStakes = joinedEvents.reduce((prev, cur) => {
                const eventType = cur.event;
                const newResult = { ...prev };
                const { user, tokenIds: strTokenIds } = cur.returnValues;
                const tokenIds = strTokenIds.map(Number);

                if (eventType === 'Staked') {
                    newResult[user] = [...(newResult[user] || []), ...tokenIds];
                } else {
                    const previousStakedIds = newResult[user] || [];
                    newResult[user] = previousStakedIds.filter(
                        (id) => !tokenIds.includes(id)
                    );
                }

                return newResult;
            }, {} as { [address: string]: number[] });

            const stakedUsers = Object.keys(userStakes).filter(
                (u) => !!userStakes[u]?.length
            );

            setStakers(stakedUsers);
        };

        fetch();
    }, [stakingContract, token]);

    React.useEffect(() => {
        if (!stakingContract || !token) {
            setCreditClaimed(ZERO);
            return;
        }
        setCreditClaimed(undefined);

        const fetch = async (): Promise<void> => {
            const claimEvents = (await stakingContract.getPastEvents(
                'ClaimDividend',
                {
                    fromBlock: 14007525,
                    toBlock: 'latest',
                    filter: { token },
                }
            )) as unknown as ClaimDividend[];

            const claimed = claimEvents
                .reduce((prev, cur) => {
                    const { amount: amountStr } = cur.returnValues;
                    const amount = new BigDecimal(amountStr);

                    return prev.add(amount);
                }, ZERO)
                .divide(BASE, 30);

            setCreditClaimed(claimed);
        };

        fetch();
    }, [stakingContract, token]);

    React.useEffect(() => {
        if (!stakingContract || !token) {
            setDividends([]);
            return;
        }
        setDividends(undefined);
        if (!stakers) return;

        const fetch = async (): Promise<void> => {
            const dividends = (
                await Promise.all(
                    stakers.map((staker) =>
                        stakingContract.methods.dividendOf(staker, token).call()
                    )
                )
            ).map((v) => new BigDecimal(v).divide(BASE, 30));

            setDividends(dividends);
        };

        fetch();
    }, [stakers, stakingContract, token]);

    return {
        claimableCredit: totalDividend,
        stakers,
        creditClaimed,
        dividends,
    };
};

export const StatsPage = (): JSX.Element => {
    const [css] = useStyletron();
    const { stakingContractAddress, tokenContractAddress } =
        useCyberpunkApesContext();
    const { claimableCredit, stakers, creditClaimed, dividends } =
        useStats(tokenContractAddress);
    const { tokenContract } = useContractContext();
    const stakedApes = useBalance(tokenContract, stakingContractAddress);
    const theme = useThemeContext();

    return (
        <div
            className={css({
                paddingTop: '130px',
                color: theme.fontColors.normal.primary.getCSSColor(1),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                [MOBILE]: {
                    paddingTop: '40px',
                },
            })}
        >
            <div
                className={css({
                    backgroundColor:
                        theme.lighterBackgroundColor.getCSSColor(0.7),
                    padding: '10px',
                    borderRadius: '10px',
                    margin: '10px',
                })}
            >
                <div
                    className={css({
                        color: theme.fontColors.normal.secondary.getCSSColor(1),
                        fontSize: '30px',
                        paddingBottom: '5px',
                        marginBottom: '10px',
                        borderBottom: `1px solid ${theme.fontColors.normal.primary.getCSSColor(
                            1
                        )}`,
                    })}
                >
                    Cyberpunk Ape Executives
                </div>
                <div>
                    <div
                        className={css({
                            color: theme.fontColors.normal.secondary.getCSSColor(
                                1
                            ),
                        })}
                    >
                        Total Dividend Claimable
                    </div>
                    {claimableCredit && (
                        <div>{roundAndDisplay(claimableCredit)} $CREDIT</div>
                    )}
                    {!claimableCredit && (
                        <div>
                            <Spinner size={SpinnerSize.small} />
                        </div>
                    )}
                </div>
                <div>
                    <div
                        className={css({
                            color: theme.fontColors.normal.secondary.getCSSColor(
                                1
                            ),
                        })}
                    >
                        Total Dividend Claimed
                    </div>
                    {creditClaimed && (
                        <div>{roundAndDisplay(creditClaimed)} $CREDIT</div>
                    )}
                    {!creditClaimed && (
                        <div>
                            <Spinner size={SpinnerSize.small} />
                        </div>
                    )}
                </div>
                <div>
                    <div
                        className={css({
                            color: theme.fontColors.normal.secondary.getCSSColor(
                                1
                            ),
                        })}
                    >
                        Total Number of Addresses Staked
                    </div>
                    {stakers && <div>{stakers?.length}</div>}
                    {!stakers && (
                        <div>
                            <Spinner size={SpinnerSize.small} />
                        </div>
                    )}
                </div>
                <div>
                    <div
                        className={css({
                            color: theme.fontColors.normal.secondary.getCSSColor(
                                1
                            ),
                        })}
                    >
                        Total Number of Apes Staked
                    </div>
                    <div>{roundAndDisplay(stakedApes)}</div>
                </div>
                <div>
                    <div
                        className={css({
                            color: theme.fontColors.normal.secondary.getCSSColor(
                                1
                            ),
                        })}
                    >
                        Top Ten Dividends
                    </div>
                    {dividends && (
                        <div>
                            {dividends
                                .sort((a, b) => b.compareTo(a))
                                .slice(0, 10)
                                .map((d) => roundAndDisplay(d))
                                .join(', ')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stats;
