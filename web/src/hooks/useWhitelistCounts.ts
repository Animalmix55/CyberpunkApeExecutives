import React from 'react';
import { toast } from 'react-toastify';
import { getWhitelist } from '../api/Requests';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import useWeb3 from './useWeb3';

interface Output {
    presale: number;
    reload: () => void;
}
export const useWhitelistCounts = (): Output => {
    const { api } = useCyberpunkApesContext();
    const { accounts } = useWeb3();
    const [count, setCounts] = React.useState<number>(0);

    const fetchCounts = React.useCallback((): void => {
        getWhitelist(api, accounts[0])
            .then((c) => {
                setCounts(c);
            })
            .catch(() =>
                toast('Failed to fetch whitelist counts', { type: 'error' })
            );
    }, [accounts, api]);

    React.useEffect(() => {
        if (!accounts[0]) {
            setCounts(0);
            return;
        }

        fetchCounts();
    }, [accounts, api, fetchCounts]);

    return { presale: count, reload: fetchCounts };
};

export default useWhitelistCounts;
