import { Account, SentTX, ConfigSchema } from 'evm-lite-lib';

interface WalletAccount extends Account {
	history: SentTX[];
}

export interface CoreReducer {
	accounts: WalletAccount[];
	config: ConfigSchema;
	directory: string;
}

export const coreReducer = (state: any, action: any) => {
	// pass
};

export default coreReducer;
