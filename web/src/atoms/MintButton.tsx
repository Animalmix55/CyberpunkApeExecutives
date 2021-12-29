import BigDecimal from 'js-big-decimal';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { PromiEvent } from 'web3-core';
import { TransactionReceipt } from 'web3-eth';
import { getMintSignature } from '../api/Requests';
import { useContractContext } from '../contexts/ContractContext';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useSessionContext } from '../contexts/SessionContext';
import useWeb3 from '../contexts/Web3Context';
import useMintDetails from '../hooks/useMintDetails';
import { CyberpunkApeExecutives } from '../models/CyberpunkApeExecutives';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { BASE, roundAndDisplay, ZERO } from '../utilties/Numbers';
import { ButtonType } from './Button';
import TransactionButton from './TransactionButton';

export const WeiToEth = (wei: number): number => wei / 1000000000000000000;

interface MintButtonProps {
    sale: 'presale' | 'public';
    amount: number;
    className?: string;
    disabled?: boolean;
    onTransact?: (val: PromiEvent<TransactionReceipt>) => void;
}
export const MintButton = (props: MintButtonProps): JSX.Element => {
    const { sale, amount, onTransact, className, disabled } = props;

    const [css] = useStyletron();
    const { mintPrice: price } = useMintDetails(sale);
    const { tokenContract: contract } = useContractContext();
    const { accounts } = useWeb3();

    const mintPrice = React.useMemo(
        () => price.multiply(new BigDecimal(amount)),
        [amount, price]
    );

    const { api } = useCyberpunkApesContext();
    const { sessionToken } = useSessionContext();

    const getPremintParams = React.useCallback(async (): Promise<
        Parameters<CyberpunkApeExecutives['methods']['premint']>
    > => {
        if (!contract) throw new Error('No contract');
        if (!sessionToken) throw new Error('Not logged in');

        const { signature, nonce } = await getMintSignature(
            api,
            sessionToken,
            amount
        );

        return [amount, nonce, signature];
    }, [amount, api, contract, sessionToken]);

    if (sale === 'public') {
        return (
            <TransactionButton
                contract={contract}
                method="mint"
                params={[amount]}
                tx={{
                    from: accounts[0],
                    value: mintPrice.multiply(BASE).floor().getValue(),
                }}
                buttonType={ButtonType.primary}
                type="button"
                onTransact={onTransact}
                disabled={
                    !contract ||
                    !accounts[0] ||
                    price.compareTo(ZERO) === 0 ||
                    disabled
                }
                className={ClassNameBuilder(
                    css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }),
                    className
                )}
            >
                Mint {amount} ({roundAndDisplay(mintPrice)} ETH + GAS)
            </TransactionButton>
        );
    }

    return (
        <TransactionButton
            contract={contract}
            method="premint"
            params={getPremintParams}
            tx={{
                from: accounts[0],
                value: mintPrice.multiply(BASE).floor().getValue(),
            }}
            buttonType={ButtonType.primary}
            type="button"
            onTransact={onTransact}
            disabled={
                !contract ||
                !accounts[0] ||
                price === undefined ||
                !sessionToken ||
                disabled
            }
            className={ClassNameBuilder(
                css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }),
                className
            )}
        >
            Mint {amount} ({roundAndDisplay(mintPrice)} ETH + GAS)
        </TransactionButton>
    );
};

export default MintButton;
