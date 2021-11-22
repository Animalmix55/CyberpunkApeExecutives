import React from 'react';
import { toast } from 'react-toastify';
import { getContractDates, TimeFrame } from '../api/Requests';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';

interface Output {
    presale: TimeFrame;
    free: TimeFrame;
    public: TimeFrame;
}

export const useSaleDates = (): Output | undefined => {
    const { api } = useCyberpunkApesContext();
    const [output, setOutput] = React.useState<Output>({
        presale: {
            start: 0,
            end: 0,
        },
        free: {
            start: 0,
            end: 0,
        },
        public: {
            start: 0,
            end: 0,
        },
    });

    React.useEffect(() => {
        getContractDates(api)
            .then((d) => {
                setOutput(d);
            })
            .catch(() =>
                toast('Failed to fetch contract dates', { type: 'error' })
            );
    }, [api]);

    return output;
};

export default useSaleDates;
