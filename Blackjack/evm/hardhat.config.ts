import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import {HardhatUserConfig} from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.16",
    networks: {
        localhost: {
            accounts:
                process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
    },
    "mocha": {
        "slow": 1000
    }
};

export default config;
