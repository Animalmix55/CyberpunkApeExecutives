import React from 'react';
import { toast } from 'react-toastify';
import { getWhitelist } from '../api/Requests';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import useWeb3 from './useWeb3';

interface Output {
    free: number;
    presale: number;
    reload: () => void;
}
export const useWhitelistCounts = (): Output => {
    const { api } = useCyberpunkApesContext();
    const { accounts } = useWeb3();
    const [counts, setCounts] = React.useState<Omit<Output, 'reload'>>({
        free: 0,
        presale: 0,
    });

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
            setCounts({ free: 0, presale: 0 });
            return;
        }

        fetchCounts();
    }, [accounts, api, fetchCounts]);

    return { ...counts, reload: fetchCounts };
};

export default useWhitelistCounts;
