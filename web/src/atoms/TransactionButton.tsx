/* eslint-disable react/jsx-props-no-spreading */
import { Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { toast } from 'react-toastify';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { BaseContract, NonPayableTx, PayableTx } from '../models/types';
import Button, { ButtonProps } from './Button';

interface Props<T extends BaseContract, M extends keyof T['methods']>
    extends ButtonProps {
    contract: T;
    method: M;
    params: Parameters<T['methods'][M]>;
    onTransact?: (val: PromiEvent<TransactionReceipt>) => void;
    tx?: NonPayableTx | PayableTx;
}

export const TransactionButton = <
    T extends BaseContract,
    M extends keyof T['methods']
>(
    props: Props<T, M>
): JSX.Element => {
    const {
        contract,
        method,
        params,
        onTransact,
        disabled,
        tx,
        children: childrenProp,
        onClick: onClickProp,
    } = props;
    const { etherscanUrl } = useCyberpunkApesContext();
    const [pending, setPending] = React.useState(false);
    const [hash, setHash] = React.useState('');

    const onClick: React.MouseEventHandler<HTMLButtonElement> =
        React.useCallback(
            async (e) => {
                if (pending && hash) {
                    window.open(`${etherscanUrl}/tx/${hash}`, '_blank');
                    return;
                }

                onClickProp?.(e);

                try {
                    await contract.methods[method](...params).estimateGas(tx);
                } catch (error) {
                    toast(String(error).split('{')[0], { type: 'error' });
                    return;
                }
                setPending(true);

                const trans = contract.methods[method](...params).send(
                    tx
                ) as PromiEvent<TransactionReceipt>;

                onTransact?.(trans);
                trans.finally(() => {
                    setPending(false);
                    setHash('');
                });
                trans.on('transactionHash', setHash);
            },
            [
                contract.methods,
                etherscanUrl,
                hash,
                method,
                onClickProp,
                onTransact,
                params,
                pending,
                tx,
            ]
        );

    const children = React.useMemo(() => {
        if (pending)
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {!hash && childrenProp}
                    {hash && 'View on Etherscan'}
                    <Spinner
                        style={{ marginLeft: '10px' }}
                        size={SpinnerSize.medium}
                    />
                </div>
            );

        return childrenProp;
    }, [childrenProp, hash, pending]);

    return (
        <Button
            {...props}
            disabled={disabled || (pending && !hash)}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export default TransactionButton;
