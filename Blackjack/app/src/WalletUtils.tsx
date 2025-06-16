import Web3 from "web3";
import {ethers} from "ethers";

function inicializarWallet(setProvider: any, setPlayerAddress: any) {
    try {
        // @ts-ignore
        const ethereum = window.ethereum;
        if (ethereum == null) {
            return;
        }
        const web3 = new Web3(ethereum)

        let currentProvider = web3.currentProvider;
        console.log('Current Provider:', currentProvider)
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(currentProvider);
        console.log('Provider:', provider)
        setProvider(provider);

        ethereum.request({method: 'eth_requestAccounts'}).then(async (x: any) => {
            console.log('Web Version: ', web3.version)
            let playerAddress = x[0];
            setPlayerAddress(playerAddress)

            let playerBalance = (await provider.getBalance(playerAddress)).toHexString();
            console.log('Player Balance: ', playerBalance)

        });
    } catch (error) {
        console.error("Ethereum error: ", error)
    }
}

export {inicializarWallet};