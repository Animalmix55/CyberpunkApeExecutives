import React from 'react';
import { useStyletron } from 'styletron-react';
import { Callout, Icon } from '@fluentui/react';
import useWeb3 from '../contexts/Web3Context';
import useDividend from '../hooks/useDividend';
import { IMDStaking } from '../models/IMDStaking';
import { ZERO } from '../utilties/Numbers';
import Button, { ButtonType } from '../atoms/Button';
import TransactionButton from '../atoms/TransactionButton';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { useThemeContext } from '../contexts/ThemeContext';
import { TooltipHost } from '../atoms/Tooltip';

interface Props {
    className?: string;
    stakingContract: IMDStaking;
    tokenContractAddress?: string;
    unstakeIds?: number[];
}

export const ClaimDividendButton = (props: Props): JSX.Element => {
    const { stakingContract, tokenContractAddress, unstakeIds, className } =
        props;
    const dividend = useDividend(stakingContract, tokenContractAddress);
    const { accounts, reload } = useWeb3();
    const [css] = useStyletron();
    const [open, setOpen] = React.useState(false);
    const theme = useThemeContext();

    const targetRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className={ClassNameBuilder(css({ display: 'flex' }), className)}>
            <TransactionButton
                contract={stakingContract}
                method="claimRewards"
                params={[tokenContractAddress]}
                disabled={
                    !tokenContractAddress || dividend.compareTo(ZERO) === 0
                }
                tx={{ from: accounts[0] }}
                buttonType={ButtonType.primary}
                className={css({
                    paddingLeft: '20px',
                    paddingRight: '20px',
                })}
                onTransact={(t): Promise<void> => t.then(reload)}
            >
                Claim Dividend
            </TransactionButton>
            {!!unstakeIds?.length && (
                <>
                    <div className={css({ width: '1px' })} />
                    <Button
                        ref={targetRef}
                        buttonType={ButtonType.primary}
                        onClick={(): void => setOpen((o) => !o)}
                        disabled={
                            !tokenContractAddress ||
                            dividend.compareTo(ZERO) === 0
                        }
                    >
                        <Icon iconName="CaretDownSolid8" />
                    </Button>
                    {open && (
                        <Callout
                            target={targetRef}
                            styles={{
                                beakCurtain: {
                                    backgroundColor:
                                        theme.lighterBackgroundColor.getCSSColor(
                                            1
                                        ),
                                },
                                beak: {
                                    backgroundColor:
                                        theme.lighterBackgroundColor.getCSSColor(
                                            1
                                        ),
                                },
                                calloutMain: {
                                    backgroundColor:
                                        theme.lighterBackgroundColor.getCSSColor(
                                            1
                                        ),
                                },
                            }}
                        >
                            <TooltipHost content="You can save gas by unstaking and claiming rewards in a single transaction">
                                <>
                                    {unstakeIds.length === 1 && (
                                        <TransactionButton
                                            contract={stakingContract}
                                            method="unstakeAndClaimRewards"
                                            params={[
                                                tokenContractAddress,
                                                unstakeIds[0],
                                            ]}
                                            disabled={
                                                !tokenContractAddress ||
                                                dividend.compareTo(ZERO) === 0
                                            }
                                            tx={{ from: accounts[0] }}
                                            buttonType={ButtonType.clear}
                                            onTransact={(t): Promise<void> =>
                                                t.then(() => {
                                                    reload();
                                                    setOpen(false);
                                                })
                                            }
                                            className={css({
                                                paddingLeft: '20px',
                                                paddingRight: '20px',
                                                minHeight: '60px',
                                            })}
                                        >
                                            Claim Dividend and Unstake
                                        </TransactionButton>
                                    )}
                                    {unstakeIds.length > 1 && (
                                        <TransactionButton
                                            contract={stakingContract}
                                            method="unstakeManyAndClaimRewards"
                                            params={[
                                                tokenContractAddress,
                                                unstakeIds,
                                            ]}
                                            disabled={
                                                !tokenContractAddress ||
                                                dividend.compareTo(ZERO) === 0
                                            }
                                            tx={{ from: accounts[0] }}
                                            buttonType={ButtonType.clear}
                                            onTransact={(t): Promise<void> =>
                                                t.then(() => {
                                                    reload();
                                                    setOpen(false);
                                                })
                                            }
                                            className={css({
                                                paddingLeft: '20px',
                                                paddingRight: '20px',
                                                minHeight: '60px',
                                            })}
                                        >
                                            Claim Dividend and Unstake
                                        </TransactionButton>
                                    )}
                                </>
                            </TooltipHost>
                        </Callout>
                    )}
                </>
            )}
        </div>
    );
};

export default ClaimDividendButton;
