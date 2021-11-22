import React from 'react';
import { TransactionReceipt } from 'web3-core';

export interface TransactionContextType {
    public: Promise<TransactionReceipt>[];
    free: Promise<TransactionReceipt>[];
    presale: Promise<TransactionReceipt>[];
}

const TransactionContext = React.createContext<
    TransactionContextType & { dispatch: (action: Action) => void }
>({
    public: [],
    free: [],
    presale: [],
    dispatch: () => '',
});

export const makeCancelable = <T,>(
    promise: Promise<T>
): { promise: Promise<T>; cancel: () => void } => {
    let isCanceled = false;
    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise
            .then((val) => (isCanceled ? reject() : resolve(val)))
            .catch((error) => (isCanceled ? reject() : reject(error)));
    });
    return {
        promise: wrappedPromise,
        cancel(): void {
            isCanceled = true;
        },
    };
};

interface Params {
    target: 'free' | 'public' | 'presale' | 'early';
    onAdded?: (trans: Promise<TransactionReceipt>) => void;
    onAllCompleted?: (transactions?: TransactionReceipt[]) => void;
}

export const useTransactionSubmitter = (
    type: 'free' | 'public' | 'presale'
): ((trans: Promise<TransactionReceipt>) => void) => {
    const { dispatch } = React.useContext(TransactionContext);

    return (trans): void => dispatch({ transaction: trans, mint: type });
};

export const useTransactions = (
    params: Params
): Omit<TransactionContextType, 'dispatch'> => {
    const { target, onAdded, onAllCompleted } = params;
    const allTransactions = React.useContext(TransactionContext);
    const transactions = React.useMemo(() => {
        return target === 'early'
            ? allTransactions.free.concat(allTransactions.presale)
            : allTransactions[target];
    }, [allTransactions, target]);

    const cancelLastPromise = React.useRef<() => void>(() => '');
    const prevLength = React.useRef(transactions.length);
    React.useEffect(() => {
        cancelLastPromise.current();

        const { promise, cancel } = makeCancelable(
            Promise.all(
                transactions.map(
                    (t) => new Promise((res) => t.then(res).catch(res))
                )
            )
        );
        cancelLastPromise.current = cancel;

        promise.then(onAllCompleted);
        promise.catch((e) => {
            if (e) onAllCompleted();
        });
    }, [onAllCompleted, target, transactions]);

    React.useEffect(() => {
        if (transactions.length === prevLength.current) return;
        prevLength.current = transactions.length;

        onAdded(transactions[transactions.length - 1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onAllCompleted, target, transactions]);

    return allTransactions;
};

interface Action {
    mint: 'free' | 'presale' | 'public';
    transaction: Promise<TransactionReceipt>;
}
const reducer = (
    state: TransactionContextType,
    action: Action
): TransactionContextType => {
    return { ...state, [action.mint]: [...state.free, action.transaction] };
};

export const TransactionContextProvider = ({
    children,
}: {
    children: React.ReactChild;
}): JSX.Element => {
    const [transactions, dispatch] = React.useReducer(reducer, {}, () => ({
        free: [],
        presale: [],
        public: [],
    }));

    return (
        <TransactionContext.Provider value={{ ...transactions, dispatch }}>
            {children}
        </TransactionContext.Provider>
    );
};
