import {expect} from "chai"
import {ethers} from "hardhat"
import {BlackjackChip} from "../typechain-types"

describe("Blackjack Chip", function () {
    let contract: any
    let blackjackChip: BlackjackChip

    beforeEach(async function () {
        contract = await ethers.getContractFactory("BlackjackChip")
        blackjackChip = await contract.deploy()
    });

    describe("Deployment", function () {
        let chipAmount = 1_000
        it("Should mint " + chipAmount + " chips", async function () {
            const [owner] = await ethers.getSigners()
            const response = await blackjackChip.mint(owner.address, chipAmount)
            expect(response).to.not.null

            let balance = await blackjackChip.balanceOf(owner.address);
            expect(balance).to.eq(chipAmount)
        });
    });
});
