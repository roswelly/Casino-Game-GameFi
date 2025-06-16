const ethers = require('ethers');
const crypto = require('crypto');

const id = crypto.randomBytes(32).toString('hex');
const privateKey = "0x" + id;
console.log("SAVE BUT DO NOT SHARE THIS:", privateKey);

const wallet = new ethers.Wallet(privateKey);
console.log("Address: " + wallet.address);