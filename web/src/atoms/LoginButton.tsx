import React from 'react';
import { toast } from 'react-toastify';
import { getLoginSignableMessage, getSessionToken } from '../api/Requests';
import { useCyberpunkApesContext } from '../contexts/CyberpunkApesContext';
import { useSessionContext } from '../contexts/SessionContext';
import useWeb3 from '../hooks/useWeb3';
import Button, { ButtonType } from './Button';

export const LoginButton = (): JSX.Element => {
    const { web3, accounts } = useWeb3();
    const { api } = useCyberpunkApesContext();
    const { setToken, sessionToken } = useSessionContext();

    const onClick = React.useCallback(() => {
        if (!web3) return;

        getLoginSignableMessage(api, accounts[0])
            .then((r) => {
                const { message, token } = r;
                web3.eth.personal
                    .sign(message, accounts[0], undefined as never)
                    .then((sig) => {
                        getSessionToken(api, sig, token)
                            .then((sessionToken) => {
                                setToken(sessionToken);
                            })
                            .catch(() =>
                                toast(
                                    'Failed to verify signature with server',
                                    { type: 'error' }
                                )
                            );
                    })
                    .catch(() =>
                        toast('Failed to get signature', { type: 'error' })
                    );
            })
            .catch(() =>
                toast('Failed to get message from login server', {
                    type: 'error',
                })
            );
    }, [accounts, api, setToken, web3]);

    return (
        <Button
            buttonType={ButtonType.primary}
            type="button"
            onClick={onClick}
            disabled={!web3 || !!sessionToken || !accounts[0]}
        >
            Login
        </Button>
    );
};

export default LoginButton;
