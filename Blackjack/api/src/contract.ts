import dotenv from "dotenv";
import {Contract, ethers} from "ethers";
import { BlackjackGame__factory } from "../../blockchain/typechain-types";

dotenv.config();

export const getContract: (environment?: ("local" | "testnet")) => Contract = (environment: "local" | "testnet" = "local") => {
  const url = environment === "local" ? process.env.LOCAL_URL : process.env.TESTNET_URL;
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contractAddress = process.env.CONTRACT_ADDRESS;
  return new ethers.Contract(contractAddress!, BlackjackGame__factory.abi, wallet);
};
