import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe.only('Escrow', () => {

    const deployOneYearLockFixture = async () => {
        const [owner, otherAccount] = await ethers.getSigners();
    
        const Escrow = await ethers.getContractFactory("Escrow");
        const escrow = await Escrow.deploy();
    
        return { escrow, owner, otherAccount };
    }

    describe('Deposit', () => {
        describe('Validations', () => {
            it('Should revert with the right error if send amount is 0', async () => {
                const { escrow, otherAccount } = await loadFixture(deployOneYearLockFixture);

                await expect(escrow.deposit(otherAccount.address)).to.be.revertedWith(
                    'Send value is 0, please set value'
                );
            })
        })
    })
})