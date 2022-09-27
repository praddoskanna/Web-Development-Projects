
const hre = require("hardhat");

async function main() {

    const horoscopeNFT = await hre.ethers.getContractFactory("horoscopeNFT");
    const contractHRSCP = await horoscopeNFT.deploy();
    await contractHRSCP.deployed();
    const myAddress = "0xB106C53378c0aeE99843CCaB37236fC688728f09";

    let txn = await contractHRSCP.mintNFT(myAddress, 'virgo');
    await txn.wait();

    console.log("Your Contract is  deployed to:", contractHRSCP.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
