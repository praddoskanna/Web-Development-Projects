const main = async() =>{
    
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.deploy("eth");
    await domainContract.deployed();
    console.log("Contract deployed to :",domainContract.address);

    
    
    let txn = await domainContract.register("mortal",{value:hre.ethers.utils.parseEther('0.1')});
    await txn.wait();

    const domainOwner = await domainContract.getAddress("mortal");
    console.log("Owner of domain:", domainOwner);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("CONTRACT BALANCE : ", hre.ethers.utils.formatEther(balance));
    // txn = await domainContract.connect(randomPerson).setRecord("doom","My Domain is Doom");
    // await txn.wait();
};

const runMain = async() =>{
    try {
        await main();
        process.exit(0);
    }catch (err){
        console.log(err);
        process.exit(1);
    }
};

runMain();