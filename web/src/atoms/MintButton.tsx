import { Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { TransactionReceipt } from 'web3-eth';
import { getMintCost, getMintSignature } from '../api/Requests';
import { useContractContext } from '../contexts/ContractContext';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useSessionContext } from '../contexts/SessionContext';
import {
    useTransactions,
    useTransactionSubmitter,
} from '../contexts/TransactionContext';
import useWeb3 from '../hooks/useWeb3';
import TargetMint from '../models/TargetMint';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import Button, { ButtonType } from './Button';

export const WeiToEth = (wei: number): number => wei / 1000000000000000000;

interface MintButtonProps {
    sale: 'presale' | 'free' | 'public';
    amount: number;
    className?: string;
    onSuccess?: (t: TransactionReceipt & { amount: number }) => void;
    onTransactionOver?: () => void;
    onTransactionFailed?: (e: unknown) => void;
}
export const MintButton = (props: MintButtonProps): JSX.Element => {
    const {
        sale,
        amount,
        onSuccess,
        onTransactionFailed,
        onTransactionOver,
        className,
    } = props;

    const [css] = useStyletron();
    const [pending, setPending] = React.useState(false);
    const [price, setPrice] = React.useState<number>();
    const { contract } = useContractContext();
    const { accounts } = useWeb3();
    const submitTransaction = useTransactionSubmitter(sale);

    const onTransactionAdded = React.useCallback(() => setPending(true), []);
    const onTransactionsCompleted = React.useCallback(
        () => setPending(false),
        []
    );

    useTransactions({
        target: sale === 'free' || sale === 'presale' ? 'early' : sale,
        onAdded: onTransactionAdded,
        onAllCompleted: onTransactionsCompleted,
    });

    React.useEffect(() => {
        getMintCost(sale, contract).then(setPrice);
    }, [contract, sale]);

    const { api } = useCyberpunkApesContext();
    const { sessionToken } = useSessionContext();

    const onClick = React.useCallback(() => {
        if (!contract) return;

        if (sale === 'public') {
            const trans = contract.methods
                .mint(amount)
                .send({ from: accounts[0], value: amount * price });

            trans
                .then((r) => onSuccess({ ...r, amount }))
                .catch(onTransactionFailed)
                .finally(onTransactionOver); // update counts

            submitTransaction(trans);
            return;
        }

        if (!sessionToken) return;

        getMintSignature(
            api,
            sessionToken,
            amount,
            sale === 'free' ? TargetMint.Free : TargetMint.Presale
        ).then((sig) => {
            const { signature, nonce } = sig;

            const trans = contract.methods
                .premint(
                    amount,
                    sale === 'free' ? TargetMint.Free : TargetMint.Presale,
                    nonce,
                    signature
                )
                .send({ from: accounts[0], value: price * amount });

            trans
                .then((r) => onSuccess({ ...r, amount }))
                .catch(onTransactionFailed)
                .finally(onTransactionOver); // update counts

            submitTransaction(trans);
        });
    }, [
        accounts,
        amount,
        api,
        contract,
        onSuccess,
        onTransactionFailed,
        onTransactionOver,
        price,
        sale,
        sessionToken,
        submitTransaction,
    ]);

    return (
        <Button
            buttonType={ButtonType.primary}
            type="button"
            onClick={onClick}
            disabled={
                !contract ||
                !accounts[0] ||
                price === undefined ||
                pending ||
                ((sale === 'free' || sale === 'presale') && !sessionToken)
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
            Mint {amount}{' '}
            {price !== undefined ? `(${WeiToEth(price * amount)} ETH)` : ''}
            {pending && (
                <Spinner
                    className={css({
                        marginLeft: '5px',
                    })}
                    size={SpinnerSize.medium}
                />
            )}
        </Button>
    );
};

export default MintButton;
