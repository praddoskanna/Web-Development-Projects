// const { ethers } = require("hardhat");
// const hre = require("hardhat");

async function main() {
  [owner, signer2, signer3] = await ethers.getSigners();
  
  SilverCoin = await hre.ethers.getContractFactory("SilverCoin");
  silverCoin = await SilverCoin.deploy();

  CrowdSale = await hre.ethers.getContractFactory("Crowdsale");
  
  //RATE : 2
  //owner address is where we store the funds raised in ICO
  //SLV token address

  crowdSale = await CrowdSale.deploy(2,owner.address,silverCoin.address);

   
  // INITIAL TOKENS : 10,000 SLVs
  await silverCoin.connect(owner).mint(
    crowdSale.address,
    ethers.utils.parseEther("10000")
  )

  // Contract and Signer Details

  console.log("CrowdSale deployed to:", crowdSale.address);
  console.log("SilverCoin deployed to:", silverCoin.address);
  console.log("Owner Address :", owner.address);
  console.log("signer2 Address :", signer2.address);
  console.log("signer3 Address :", signer3.address);


}

//npx hardhat node
//npx hardhat run --network localhost scripts/deploy.js

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
