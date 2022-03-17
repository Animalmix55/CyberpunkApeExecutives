import React from 'react';
import { useCyberpunkApesContext } from './CyberpunkApesContext';
import useWeb3 from './Web3Context';
import { IERC721Metadata } from '../models/IERC721Metadata';
import IERC721MetadataAbi from '../assets/IERC721MetadataAbi.json';

interface StakingToken {
    shortName: string;
    longName: string;
    address: string;
}
type StakingTokenOptions = { [address: string]: StakingToken };

export interface StakingTokenContextType {
    tokenAddress?: string;
    tokenContract?: IERC721Metadata;
    selectedOption?: StakingToken;
    setTokenAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    options: StakingTokenOptions;
}

export const StakingTokenContext = React.createContext<StakingTokenContextType>(
    { setTokenAddress: (): string => '', options: {} }
);

export const StakingTokenProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const { web3 } = useWeb3();
    const { lengendsContractAddress, tokenContractAddress } =
        useCyberpunkApesContext();

    const [tokenAddress, setTokenAddress] =
        React.useState(tokenContractAddress);

    const tokenContract = React.useMemo(() => {
        if (!web3 || !tokenAddress) return undefined;

        return new web3.eth.Contract(
            IERC721MetadataAbi as never,
            tokenAddress
        ) as never as IERC721Metadata;
    }, [tokenAddress, web3]);

    const options = React.useMemo<StakingTokenOptions>(
        () => ({
            ...(tokenContractAddress && {
                [tokenContractAddress]: {
                    shortName: 'CAE',
                    longName: 'Cyberpunk Ape Executives',
                    address: tokenContractAddress,
                },
            }),
            ...(lengendsContractAddress && {
                [lengendsContractAddress]: {
                    shortName: 'CAEL',
                    longName: 'Cyberpunk Ape Executive Legends',
                    address: lengendsContractAddress,
                },
            }),
        }),
        [lengendsContractAddress, tokenContractAddress]
    );

    const selectedOption = options[tokenAddress];

    return (
        <StakingTokenContext.Provider
            value={{
                setTokenAddress,
                tokenAddress,
                options,
                tokenContract,
                selectedOption,
            }}
        >
            {children}
        </StakingTokenContext.Provider>
    );
};

export const useStakingToken = (): StakingTokenContextType =>
    React.useContext(StakingTokenContext);
