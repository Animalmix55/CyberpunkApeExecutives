import React from 'react';
import jwt_decode from 'jwt-decode';
import useWeb3 from '../hooks/useWeb3';

export interface SessionContextType {
    sessionToken?: string;
    setToken: (token?: string) => void;
}

const SessionContext = React.createContext<SessionContextType>({
    setToken: (): string => '',
});

export const useSessionContext = (): SessionContextType =>
    React.useContext(SessionContext);

interface Claims {
    address: string;
}

export const SessionContextProvider = ({
    children,
}: {
    children: React.ReactChild;
}): JSX.Element => {
    const [_sessionToken, _setToken] = React.useState<string>();
    const { accounts } = useWeb3();

    const claims = React.useMemo(
        () => (_sessionToken ? jwt_decode<Claims>(_sessionToken) : undefined),
        [_sessionToken]
    );

    React.useEffect(() => {
        const token = sessionStorage.getItem('sessionToken');
        if (token) _setToken(token);
    }, []);

    const setToken = React.useCallback((token: string) => {
        sessionStorage.setItem('sessionToken', token);
        _setToken(token);
    }, []);

    // only provide session token if it matches the current account
    const sessionToken = React.useMemo(() => {
        if (!_sessionToken) return undefined;

        const { address } = claims;
        if (address.toLowerCase() !== accounts[0]?.toLowerCase()) {
            return undefined;
        }
        return _sessionToken;
    }, [_sessionToken, accounts, claims]);

    return (
        <SessionContext.Provider value={{ sessionToken, setToken }}>
            {children}
        </SessionContext.Provider>
    );
};
