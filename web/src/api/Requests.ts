/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export interface TimeFrame {
    start: number;
    end: number;
}

export const getMintCost = async (
    sale: 'free' | 'presale' | 'public',
    contract?: any
): Promise<number> => {
    if (!contract) return 0;

    switch (sale) {
        default:
        case 'free':
            return 0;
        case 'presale':
            return Number(
                (await contract.methods.getPresaleMint().call()).mintPrice
            );
        case 'public':
            return Number(
                (await contract.methods.getPublicMint().call()).mintPrice
            );
    }
};

export const getPublicTransactionMax = async (
    contract?: any
): Promise<number> => {
    if (!contract) return 0;

    return Number(
        (await contract.methods.getPublicMint().call()).maxPerTransaction
    );
};

export const getContractDates = async (
    api: string
): Promise<{
    presale: TimeFrame;
    free: TimeFrame;
    public: TimeFrame;
}> => {
    const url = `${api}/contract.php`;
    const result = await axios.get(url);

    return result.data as never;
};

export const getLoginSignableMessage = async (
    api: string,
    address: string
): Promise<{ token: string; message: string }> => {
    const url = `${api}/login.php`;
    const result = await axios.post(url, { address });

    return result.data as never;
};

export const getSessionToken = async (
    api: string,
    signedMessage: string,
    signedMessageToken: string
): Promise<string> => {
    const url = `${api}/login.php`;
    const result = await axios.post(url, {
        token: signedMessageToken,
        signature: signedMessage,
    });

    return String(result.data);
};

export const getMintSignature = async (
    api: string,
    sessionToken: string,
    quantity: number,
    targetMint: any
): Promise<{ signature: string; nonce: number }> => {
    const url = `${api}/mint.php`;
    const result = await axios.post(url, {
        quantity,
        mintId: targetMint,
        token: sessionToken,
    });

    return result.data as never;
};

export const getWhitelist = async (
    api: string,
    address: string
): Promise<{ presale: number; free: number }> => {
    const url = `${api}/whitelist.php?address=${address}`;
    const result = await axios.get(url);

    return result.data as never;
};
