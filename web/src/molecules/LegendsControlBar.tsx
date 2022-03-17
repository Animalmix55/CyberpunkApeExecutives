import React from 'react';
import { useStyletron } from 'styletron-react';
import BigDecimal from 'js-big-decimal';
import { useThemeContext } from '../contexts/ThemeContext';
import RewardBalanceWidget from '../atoms/Widgets/RewardBalanceWidget';
import { MOBILE } from '../utilties/MediaQueries';
import LegendsBalanceWidget from '../atoms/Widgets/LegendsWidgets/LegendsBalanceWidget';
import { useConfirmationContext } from '../contexts/ConfirmationPromptContext';
import { useContractContext } from '../contexts/ContractContext';
import useApproved from '../hooks/useApproved';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { CyberpunkApeLegends } from '../models/CyberpunkApeLegends';
import useWeb3 from '../contexts/Web3Context';
import TransactionButton from '../atoms/TransactionButton';
import { ButtonType } from '../atoms/Button';
import { MAXUINT256, roundAndDisplay, ZERO } from '../utilties/Numbers';
import { useUnmintedLegends } from '../contexts/UnmintedLegendContext';

interface PurchaseButtonProps {
    legendContract: CyberpunkApeLegends;
    className?: string;
    lengendsContractAddress?: string;
    selectedIds: number[];
    onPurchased?: () => void;
}

const PurchaseButton = (props: PurchaseButtonProps): JSX.Element => {
    const {
        legendContract,
        className,
        lengendsContractAddress,
        selectedIds,
        onPurchased,
    } = props;

    const { rewardTokenContract } = useContractContext();
    const { accounts } = useWeb3();
    const [css] = useStyletron();

    const unmintedLegends = useUnmintedLegends();

    const totalPrice = React.useMemo(() => {
        if (!unmintedLegends) return ZERO;
        const { prices, ids } = unmintedLegends;

        return selectedIds.reduce((prev, cur): BigDecimal => {
            const index = ids.indexOf(cur);
            return prev.add(prices[index]);
        }, ZERO);
    }, [selectedIds, unmintedLegends]);

    const { approved, update } = useApproved(
        rewardTokenContract,
        lengendsContractAddress
    );

    const confirm = useConfirmationContext();

    if (!lengendsContractAddress) return <></>;

    if (!approved && rewardTokenContract)
        return (
            <TransactionButton
                contract={rewardTokenContract}
                method="approve"
                buttonType={ButtonType.primary}
                className={className}
                params={async (): Promise<[string, string]> => {
                    const response = await confirm(
                        'Heads Up',
                        'Approval gives our contract access to move $CREDIT on your behalf. After the approval transaction completes, you will need to click the Purchase button to purchase your selection. This transaction DOES NOT puchase anything.',
                        'Continue',
                        'Go Back'
                    );
                    if (!response) throw new Error('Approval Canceled');
                    return [lengendsContractAddress, MAXUINT256.getValue()];
                }}
                onTransact={(v): Promise<void> => v.then(update)}
                tx={{ from: accounts[0] }}
            >
                Approve
            </TransactionButton>
        );

    return (
        <>
            {selectedIds.length > 1 && (
                <TransactionButton
                    contract={legendContract}
                    method="mintMany"
                    buttonType={ButtonType.primary}
                    className={className}
                    params={[selectedIds]}
                    tx={{ from: accounts[0] }}
                    onTransact={(v): Promise<void> => v.then(onPurchased)}
                >
                    <div>
                        <div>Purchase</div>
                        <div className={css({ fontSize: '10px' })}>
                            {roundAndDisplay(totalPrice)} $CREDIT
                        </div>
                    </div>
                </TransactionButton>
            )}
            {selectedIds.length <= 1 && (
                <TransactionButton
                    contract={legendContract}
                    method="mint"
                    buttonType={ButtonType.primary}
                    params={[selectedIds[0]]}
                    disabled={selectedIds.length === 0}
                    tx={{ from: accounts[0] }}
                    className={className}
                    onTransact={(v): Promise<void> => v.then(onPurchased)}
                >
                    <div>
                        <div>Purchase</div>
                        <div className={css({ fontSize: '10px' })}>
                            {roundAndDisplay(totalPrice)} $CREDIT
                        </div>
                    </div>
                </TransactionButton>
            )}
        </>
    );
};

interface Props {
    selectedIds: number[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}
export const LegendsControlBar = (props: Props): JSX.Element => {
    const { selectedIds, setSelectedIds } = props;

    const [css] = useStyletron();
    const theme = useThemeContext();

    const { reload } = useWeb3();
    const { lengendsContractAddress } = useCyberpunkApesContext();
    const { legendsContract } = useContractContext();

    if (!legendsContract) return <></>;

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
                        margin: '10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
                <LegendsBalanceWidget
                    className={css({
                        margin: '10px auto 10px 10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                />
                <PurchaseButton
                    className={css({
                        margin: '10px',
                        borderRadius: '10px',
                        [MOBILE]: {
                            flexGrow: 1,
                        },
                    })}
                    legendContract={legendsContract}
                    lengendsContractAddress={lengendsContractAddress}
                    onPurchased={(): void => {
                        setSelectedIds([]);
                        reload();
                    }}
                    selectedIds={selectedIds}
                />
            </div>
        </div>
    );
};

export default LegendsControlBar;
