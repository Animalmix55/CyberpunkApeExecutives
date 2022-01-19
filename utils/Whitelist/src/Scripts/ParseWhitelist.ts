import fs from 'fs';
import Web3 from 'web3';
import { WhitelistDict, WhitelistedUser } from '../Models/Meta';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ENS = require('ethereum-ens');

const resolveENS = async (ensAddress: string, provider: string) => {
    if (!ensAddress.includes('.eth')) return undefined;
    const web3Provider = new Web3.providers.HttpProvider(provider);
    const ens = new ENS(web3Provider);

    try {
        const address = String(await ens.resolver(ensAddress).addr());
        return address;
    } catch (e) {
        console.warn('Failed to resolve ENS:', ensAddress);
        return undefined;
    }
};

export const parseWhitelist = async (files: string[], web3Provider: string) => {
    const whitelist = (
        await Promise.all(
            files.map(async (filePath) => {
                const contents = fs.readFileSync(filePath).toString();
                const lines = contents.split('\r\n');

                const accounts = (
                    await Promise.all(
                        lines.map(async (line) => {
                            const cells = line.split(',').map((l) => l.trim());
                            const [address, , , numMints, ,] = cells;

                            let finalAddress;

                            if (address && Web3.utils.isAddress(address)) {
                                finalAddress = address;
                            } else if (
                                address &&
                                address.toLowerCase().includes('.eth')
                            ) {
                                const resolvedAddress = await resolveENS(
                                    address,
                                    web3Provider
                                );
                                if (resolvedAddress)
                                    finalAddress = resolvedAddress;
                            }

                            if (!finalAddress) return undefined;

                            if (Number.isNaN(Number(numMints))) {
                                console.warn(
                                    `Invalid number of mints for ${address}: ${numMints}`
                                );
                                return undefined;
                            }

                            const whitelistedUser: WhitelistedUser = {
                                address: finalAddress,
                                amount: Number(numMints),
                            };

                            return whitelistedUser;
                        })
                    )
                ).filter((a) => !!a) as WhitelistedUser[];

                return accounts;
            })
        )
    ).reduce((agWhitelist, curWhitelist) => {
        const whitelist = { ...agWhitelist };
        curWhitelist.forEach((wlUser) => {
            const curRecord = whitelist[wlUser.address];
            if (curRecord && curRecord.amount >= wlUser.amount) return;

            whitelist[wlUser.address] = wlUser;
        });

        return whitelist;
    }, {} as WhitelistDict);

    return Object.keys(whitelist).map((address) => whitelist[address]);
};

export default parseWhitelist;
