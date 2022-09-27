const hre = require("hardhat");

async function main() {

  const horoscopeNFT = await hre.ethers.getContractFactory("horoscopeNFT");
  const contractHRSCP = await horoscopeNFT.deploy();
  await contractHRSCP.deployed();

  console.log("Your Contract is  deployed to:", contractHRSCP.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
