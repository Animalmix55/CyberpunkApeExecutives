import BigDecimal from 'js-big-decimal';
import React from 'react';
import useWeb3 from '../contexts/Web3Context';
import { IERC20 } from '../models/IERC20';
import { IERC20Metadata } from '../models/IERC20Metadata';
import { IERC721 } from '../models/IERC721';
import { IERC721Metadata } from '../models/IERC721Metadata';
import { ZERO } from '../utilties/Numbers';

const isERC721 = (
    token?: IERC20Metadata | IERC721Metadata | IERC721 | IERC20
): token is IERC721 | IERC721Metadata => {
    if (!token) return false;

    if ((token as IERC721).methods.setApprovalForAll) return true;
    return false;
};

export const useApproved = (
    token?: IERC20Metadata | IERC721Metadata | IERC721 | IERC20,
    address?: string
): { approved: boolean; update: () => void } => {
    const { accounts } = useWeb3();
    const [approved, setApproved] = React.useState<boolean>(false);

    const update = React.useCallback(() => {
        if (!token || !address) return;

        if (isERC721(token)) {
            token.methods
                .isApprovedForAll(accounts[0], address)
                .call()
                .then(setApproved)
                .catch(() => setApproved(false));
            return;
        }

        token.methods
            .allowance(accounts[0], address)
            .call()
            .then((a) => {
                const allowance = new BigDecimal(a);
                setApproved(allowance.compareTo(ZERO) > 0);
            })
            .catch(() => setApproved(false));
    }, [accounts, address, token]);

    React.useEffect(update, [update]);

    return { approved, update };
};

export default useApproved;
