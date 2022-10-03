const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('TESTING', () => {
    beforeEach(async () => {
        [owner, signer2, signer3] = await ethers.getSigners();

        SilverCoin = await ethers.getContractFactory('SilverCoin', owner);
        silverCoin = await SilverCoin.deploy();

        Crowdsale = await ethers.getContractFactory('Crowdsale', owner);
        crowdSale = await Crowdsale.deploy(2, owner.address, silverCoin.address);
    });


    describe('buyTokens', () => {
        it('adds a token symbol', async () => {
            let totalSupply;
            let signer2Balance;
            let signer3Balance;

            totalSupply = await silverCoin.totalSupply()
            signer2Balance = await silverCoin.balanceOf(signer2.address)
            signer3Balance = await silverCoin.balanceOf(signer3.address)
            expect(totalSupply).to.be.equal(0)
            expect(signer2Balance).to.be.equal(0)
            expect(signer3Balance).to.be.equal(0)

            await silverCoin.connect(owner).mint(
                crowdSale.address,
                ethers.utils.parseEther('10000')
            )

            const ownerEtherBalanceOld = await owner.getBalance()

            await crowdSale.connect(signer2).buyTokens(signer2.address, { value: ethers.utils.parseEther('10') })
            await crowdSale.connect(signer3).buyTokens(signer3.address, { value: ethers.utils.parseEther('20') })

            totalSupply = await silverCoin.totalSupply()
            signer2Balance = await silverCoin.connect(owner).balanceOf(signer2.address)
            signer3Balance = await silverCoin.connect(owner).balanceOf(signer3.address)
            const ownerEtherBalanceNew = await owner.getBalance()

            expect(totalSupply).to.be.equal(ethers.utils.parseEther('10000'))
            expect(signer2Balance).to.be.equal(ethers.utils.parseEther('20'))
            expect(signer3Balance).to.be.equal(ethers.utils.parseEther('40'))
            expect(ownerEtherBalanceNew).to.be.above(ownerEtherBalanceOld)
        })
    })
})