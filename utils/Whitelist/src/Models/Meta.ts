export interface WhitelistedUser {
    address: string;
    amount: number;
};

export type WhitelistDict = { [address: string]: WhitelistedUser };
export type Whitelist = WhitelistedUser[];