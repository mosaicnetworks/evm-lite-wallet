# EVM-Lite Wallet

A user interface to interact with EVM-Lite.

## Adding Modules

Modules are a set of actions related to a topic the wallet should exhibit. For exmaple currently one of the modules the wallet uses is `accounts`. This module handles everything from listing to decrypting accounts.

In order to add a module you need to have the following coded:

- A list of `actions` for the assosiated module.
- A pure function (`reducer`) to return a state based on the dispatched action
- A `redux-thunk` handler to define the logic for the given action.

### Example

As an example I will try and add the listing of accounts feature into the `accounts` module. Firstly I would create a file name `accounts.ts` in `src/modules`. Then define the following `const`'s to represent the different stages in listing accounts.

```typescript
// When the `List` request is initialized
const LIST_REQUEST = '@monet/accounts/LIST/REQUEST';

// When the `List` request is successful
const LIST_SUCCESS = '@monet/accounts/LIST/SUCCESS';

// When the `List` request is throwing an error
const LIST_ERROR = '@monet/accounts/LIST/ERROR';
```

Now that we have defined the `actions`, to represent the intemediary steps in listing accounts, we need now need to define a reducer to handle what happens to the `state` when it receives one of these `actions. 

Note: `reducers` are pure functions.

```typescript
// The `AccountsState` is an interface defining the 
// structure of the state of this module
export interface AccountsState {
    all: BaseAccount[];
    unlocked?: Account;
    error?: string;
    loading: {
        list: boolean;
        get: boolean;
        create: boolean;
        unlock: boolean;
    };
}

// Initial state of the module
const initialState: AccountsState = {
    all: [],
    loading: {
        list: false,
        get: false,
        create: false,
        unlock: false
    }
};

// The reducer should a default export of the module
export default function reducer(
    state: AccountsState = initialState,
    action: BaseAction<any> = {} as BaseAction<any>
): AccountsState {
    switch (action.type) {
        // On request the `error` and `all` should be reset
        // The loading for `list` should be set to true
        case LIST_REQUEST:
            return {
                ...state,
                all: [],
                error: undefined,
                loading: {
                    ...state.loading,
                    list: true
                }
            };
        // On success the `all` should be set to the payload
        // In this case the payload is of type `BaseAccount[]`
        // Notice the loading of `list` is also set to false
        case LIST_SUCCESS:
            return {
                ...state,
                all: action.payload,
                loading: {
                    ...state.loading,
                    list: false
                }
            };
        // On error set the `error` to the payload
        // Also set the `list` loading to false
        case LIST_ERROR:
            return {
                ...state,
                all: [],
                error: action.payload,
                loading: {
                    ...state.loading,
                    list: false
                }
            };
        default:
            return state;
    }
}
```

Now that a reducer has been set up, you will need to set up the `thunk` handlers to define the logic to `list` accounts.

```typescript
// The return type of this function should be wrappedin `ThunkResult`
// In this case the function returns a promise which when resolved 
// will contain an array of `BaseAccount`
export function list(): ThunkResult<Promise<BaseAccount[]>> {
    return async (dispatch, getState) => {
        const state = getState();

        let accounts: BaseAccount[] = [];

        // Dispatch that the `list` request has started
        dispatch({
            type: LIST_REQUEST
        });

        try {
            let connection: EVMLC | undefined;
            const config = state.config.data;

            if (!config.storage) {
                throw Error('Configuration data not loaded.');
            }

            connection = new EVMLC(
                config.connection.host,
                config.connection.port,
                {
                    from: config.defaults.from,
                    gas: config.defaults.gas,
                    gasPrice: config.defaults.gasPrice
                }
            );

            await connection.testConnection().catch(() => {
                connection = undefined;
            });

            const keystore = new Keystore(config.storage.keystore);

            accounts = await keystore.list(connection).catch(error => {
                dispatch({
                    type: LIST_ERROR,
                    payload: error.toString()
                });

                return [];
            });

            // Dispatch to confirm the results of a successful `list`
            dispatch({
                type: LIST_SUCCESS,
                payload: accounts
            });
        } catch (error) {
            dispatch({
                type: LIST_ERROR,
                payload: error.toString()
            });
        }

        return accounts;
    };
}
```

## Development

Curretly working with a development version of `evm-lite-lib`. Clone `evm-lite-lib` and checkout the `node12` branch (soon to be removed).

Navigate the the `evm-lite-lib` then rune the following commands:

```bash
cd ./src/evm-lite-core/ && npm install && npm link 
cd ../../ && npm install && npm link evm-lite-core && npm link
```

This will add a symlink of the `evm-lite-lib`.

Now to finish up setting up the development evironment run these commands in `evm-lite-wallet`:

```bash
npm install && npm link evm-lite-lib && npm run build
```

Now you should have a the foundations set up to run the `electron` and the `dev-server`.

### Development Server (Hot Reloading)

```bash
npm run start:dev
```

### Electron Window

```bash
npm run start:electron
```

## Installation

To build and run `EVM-Lite Wallet`, simply execute the command:

```console
npm run start
```

This will install all dependencies and run an electron window
rendering the contents of the built project from the `dist` folder.

### Data Directory

All accounts created, transactions sent and configuration changes will
be saved to the data directory specified in the Settings tab of the
wallet. The data directory by default with be set to
`~/.evmlc` which is the same as
[`evm-lite-cli`](https://github.com/mosaicnetworks/evm-lite-cli).

If you decide to change the data directory to a new location where
the `keystore` folder or the `config.toml` file are not present, they will
be generated by default.

Note: The keystore is relative to the configuration file and not the
data directory.
