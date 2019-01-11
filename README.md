# EVM-Lite Wallet

An interactive user interface to interact with EVM-Lite.

## Installation
To build and run `EVM-Lite Wallet`, simply execute the command: 

```
make
```

This will install all dependencies and  run an electron window 
rendering the contents of the built project from the `dist` folder.

## Usage
If the installation was successful you should see the electron window 
that looks something similar to this:

![Alt Wallet Homepage](artifacts/homepage.png?raw=true "Wallet")

### Data Directory
All accounts created, transactions set and configuration changes will
be saved to the data directory specified in the `Settings` tab of the
wallet. The data directory by default with be set to 
`~/.evmlc` which is the same as 
[`evm-lite-cli`](https://github.com/mosaicnetworks/evm-lite-cli).

If you decide to change the data directory to a new location where
the keystore folder or the configuration file are not present they will
be generated.

