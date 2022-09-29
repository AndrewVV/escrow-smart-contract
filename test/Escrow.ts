import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe.only('Escrow', () => {
    const deployFixture = async () => {
        const [owner, otherAccount] = await ethers.getSigners();

        const Escrow = await ethers.getContractFactory('Escrow');
        const escrow = await Escrow.deploy();

        return { escrow, owner, otherAccount };
    };

    describe('Deposit', () => {
        describe('Validations', () => {
            it('Should revert with the right error if send amount is 0', async () => {
                const { escrow, otherAccount } = await loadFixture(deployFixture);

                await expect(escrow.deposit(otherAccount.address)).to.be.revertedWith(
                    'Send value is 0, please set value'
                );
            });
        });

        describe('Events', () => {
            it('Should emit an event on deposit', async () => {
                const { escrow, otherAccount } = await loadFixture(deployFixture);
                const amount = 1;

                await expect(escrow.deposit(otherAccount.address, { value: amount }))
                    .to.emit(escrow, 'Deposited')
                    .withArgs(otherAccount.address, amount);
            });
        });

        describe('Transfers', () => {
            it('Should deposit the funds to the contract', async () => {
                const { escrow, owner, otherAccount } = await loadFixture(deployFixture);
                const amount = 1;

                await expect(
                    escrow.deposit(otherAccount.address, { value: amount })
                ).to.changeEtherBalances([owner, escrow], [-amount, amount]);
            });
        });
    });

    describe('Withdraw', () => {
        describe('Validations', () => {
            it('Should revert with the right error if status verify is false', async () => {
                const { escrow, otherAccount } = await loadFixture(deployFixture);

                await expect(escrow.withdraw(otherAccount.address)).to.be.revertedWith(
                    'Status verify is false, please ask deposit sender to verify'
                );
            });

            it('Should revert with the right error if payee is not msg.sender', async () => {
                const { escrow, otherAccount } = await loadFixture(deployFixture);
                const amount = 1;
                escrow.deposit(otherAccount.address, { value: amount });
                await escrow.verify(otherAccount.address);

                await expect(escrow.withdraw(otherAccount.address)).to.be.revertedWith(
                    'Address payee is not address msg.sender, please change the payee'
                );
            });
        });

        describe('Events', () => {
            it('Should emit an event on withdraw', async () => {
                const { escrow, otherAccount } = await loadFixture(deployFixture);
                const amount = 1;
                escrow.deposit(otherAccount.address, { value: amount });
                await escrow.verify(otherAccount.address);

                await expect(escrow.connect(otherAccount).withdraw(otherAccount.address))
                    .to.emit(escrow, 'Withdrawn')
                    .withArgs(otherAccount.address, amount);
            });
        });

        describe('Transfers', () => {
            it('Should withdraw the funds to the payee', async () => {
                const { escrow, otherAccount } = await loadFixture(deployFixture);
                const amount = 1;
                escrow.deposit(otherAccount.address, { value: amount });
                await escrow.verify(otherAccount.address);

                await expect(
                    escrow.connect(otherAccount).withdraw(otherAccount.address)
                ).to.changeEtherBalances([escrow, otherAccount], [-amount, amount]);
            });
        });
    });
});
