import { MessageBar, MessageBarType, Slider } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import LoginButton from '../atoms/LoginButton';
import MintButton from '../atoms/MintButton';
import { useSessionContext } from '../contexts/SessionContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useCurrentTime from '../hooks/useCurrentTime';
import useMintDetails from '../hooks/useMintDetails';
import useWhitelistCounts from '../hooks/useWhitelistCounts';
import { MOBILE } from '../utilties/MediaQueries';
import FormatTimeOffset from '../utilties/TimeFormatter';

interface SaleModuleProps {
    target: 'presale' | 'public';
    startDate: number;
    endDate?: number;
    eligibleCount?: number;
    maxPerTransaction?: number;
    disabled?: boolean;
    onTransact?: (trans: PromiEvent<TransactionReceipt>) => void;
    refreshCounts: () => void;
}

export const LoginPrompt = (): JSX.Element => {
    const [css] = useStyletron();
    const { presale } = useWhitelistCounts();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                color: theme.fontColors.normal.primary.getCSSColor(1),
                margin: '10px',
                minWidth: '300px',
                flexBasis: '40%',
                flexGrow: 1,
                backgroundColor: theme.lighterBackgroundColor.getCSSColor(0.7),
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                alignSelf: 'stretch',
                [MOBILE]: {
                    marginLeft: 'unset !important',
                    marginRight: 'unset !important',
                },
            })}
        >
            <h1
                className={css({
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                Login to View Whitelist Mints
            </h1>
            <div className={css({ marginBottom: '10px' })}>
                You have {presale} presale slots
            </div>
            <div
                className={css({
                    marginTop: 'auto',
                })}
            >
                <LoginButton />
            </div>
        </div>
    );
};

export const SaleModule = (props: SaleModuleProps): JSX.Element => {
    const {
        target,
        startDate,
        endDate,
        eligibleCount,
        maxPerTransaction,
        refreshCounts,
        onTransact,
        disabled,
    } = props;

    const theme = useThemeContext();
    const time = useCurrentTime();
    const [css] = useStyletron();
    const [amount, setAmount] = React.useState(1);

    const displayName = React.useMemo(() => {
        switch (target) {
            case 'presale':
                return 'Whitelist Mint';
            default:
            case 'public':
                return 'Public Mint';
        }
    }, [target]);

    if (endDate && time > endDate) return <></>;

    return (
        <div
            className={css({
                color: theme.fontColors.normal.primary.getCSSColor(1),
                margin: '10px',
                minWidth: '300px',
                flexBasis: '100%',
                flexGrow: 1,
                backgroundColor: theme.lighterBackgroundColor.getCSSColor(0.7),
                borderRadius: '10px',
                overflow: 'hidden',
                padding: '20px',
                alignSelf: 'stretch',
                [MOBILE]: {
                    marginLeft: 'unset !important',
                    marginRight: 'unset !important',
                },
            })}
        >
            <h1
                className={css({
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                {displayName}
            </h1>
            {eligibleCount === 0 && (
                <div>
                    Sorry, you are not eligible for {displayName.toLowerCase()}
                </div>
            )}
            {(eligibleCount === undefined || eligibleCount > 0) &&
                startDate > time && (
                    <>
                        <div>
                            Time Until {displayName}:{' '}
                            {FormatTimeOffset(startDate - time)}
                        </div>
                        {eligibleCount !== undefined && (
                            <div>
                                You have {eligibleCount}{' '}
                                {displayName.toLowerCase()} slots!
                            </div>
                        )}
                    </>
                )}
            {eligibleCount !== 0 &&
                startDate <= time &&
                (!endDate || endDate >= time) && (
                    <>
                        {eligibleCount !== undefined && (
                            <div>
                                You have {eligibleCount}{' '}
                                {displayName.toLowerCase()} slots!
                            </div>
                        )}
                        {endDate && (
                            <div>
                                Time Remaining:{' '}
                                {FormatTimeOffset(endDate - time)}
                            </div>
                        )}
                        {maxPerTransaction !== undefined && (
                            <div>Max per transaction: {maxPerTransaction}</div>
                        )}
                        <Slider
                            styles={{
                                titleLabel: {
                                    color: theme.fontColors.normal.secondary.getCSSColor(
                                        1
                                    ),
                                },
                            }}
                            showValue={false}
                            value={amount}
                            onChange={setAmount}
                            disabled={disabled}
                            min={1}
                            max={
                                eligibleCount !== undefined
                                    ? Math.min(
                                          maxPerTransaction || Infinity,
                                          eligibleCount || Infinity
                                      )
                                    : maxPerTransaction || 0
                            }
                            label="Number to Mint"
                            className={css({ marginTop: '10px' })}
                        />
                        <MintButton
                            className={css({
                                marginTop: '10px',
                                height: '90px',
                                borderRadius: '10px',
                            })}
                            sale={target}
                            amount={amount}
                            disabled={disabled}
                            onTransact={(trans): void => {
                                onTransact?.(trans);
                                trans.finally((): void => {
                                    refreshCounts();
                                    setAmount(1);
                                });
                            }}
                        />
                    </>
                )}
        </div>
    );
};

export const MintDock = (): JSX.Element => {
    const { startDate: presaleStart, endDate: presaleEnd } =
        useMintDetails('presale');

    const { startDate: publicStart, maxPerTransaction: publicMax } =
        useMintDetails('public');

    const { sessionToken } = useSessionContext();
    const [showAlert, setShowAlert] = React.useState<boolean>();
    const [showInfo, setShowInfo] = React.useState<boolean>(true);
    const [disablePreminting, setDisablePreminting] =
        React.useState<boolean>(false);
    const [loadTime] = React.useState(Date.now() / 1000);

    const { presale: presaleCount, reload } = useWhitelistCounts();
    const [css] = useStyletron();

    return (
        <div
            className={css({
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginBottom: '30px',
            })}
        >
            {presaleCount > 0 && (
                <>
                    {showAlert && (
                        <MessageBar
                            onDismiss={(): void => setShowAlert(false)}
                            title="Notice"
                            className={css({ margin: '10px' })}
                            messageBarType={MessageBarType.warning}
                            messageBarIconProps={{ iconName: 'Warning' }}
                        >
                            Heads up: Only one whitelist mint transaction can
                            occur at a time. Only the first verified transaction
                            will succeed.
                        </MessageBar>
                    )}
                    {(showInfo && presaleStart <= loadTime) ||
                        publicStart <= loadTime ||
                        (publicStart <= loadTime && (
                            <MessageBar
                                onDismiss={(): void => setShowInfo(false)}
                                className={css({ margin: '10px' })}
                                messageBarType={MessageBarType.info}
                                messageBarIconProps={{ iconName: 'Warning' }}
                            >
                                You should not need to refresh the page when
                                mints begin. But you can if you want to!
                            </MessageBar>
                        ))}
                    {sessionToken && (
                        <>
                            <SaleModule
                                target="presale"
                                startDate={presaleStart}
                                endDate={presaleEnd}
                                eligibleCount={presaleCount}
                                disabled={disablePreminting}
                                refreshCounts={reload}
                                onTransact={(v): void => {
                                    setShowAlert(true);
                                    setDisablePreminting(true);

                                    v.finally(() =>
                                        setDisablePreminting(false)
                                    );
                                }}
                            />
                        </>
                    )}
                    {!sessionToken && <LoginPrompt />}
                </>
            )}
            <SaleModule
                target="public"
                startDate={publicStart}
                refreshCounts={reload}
                maxPerTransaction={publicMax}
            />
        </div>
    );
};

export default MintDock;
