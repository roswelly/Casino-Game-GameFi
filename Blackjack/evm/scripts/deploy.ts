import { ethers } from "hardhat";

async function main() {
  console.log("Deploying...");

  const BlackjackChip = await ethers.getContractFactory("BlackjackChip");
  const contract = await BlackjackChip.deploy();
  await contract.deployed();

  console.log("BlackjackChip contract deployed at:", contract);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
