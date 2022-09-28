
const main = async () => {
    const domainContractFactory = await  hre.ethers.getContractFactory('Domains');
    const domainContract = await domainContractFactory.deploy("dev");
    await domainContract.deployed();

    console.log("Contract deployed at :",domainContract.address);

    let txn= await domainContract.register("pradosh",{value: hre.ethers.utils.parseEther('0.1')});
    await txn.wait();
    console.log("Minted Domain pradosh.dev");

    txn = await domainContract.setRecord("pradosh","I am a Web Developer");
    await txn.wait();
    console.log("Set Record for pradosh.dev");

    const address = await domainContract.getAddress("pradosh");
    console.log("owner of pradosh domain :",address);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance :",hre.ethers.utils.formatEther(balance));
}

const runMain = async () =>{
    try {
        await main();
        process.exit(0);

    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

runMain();