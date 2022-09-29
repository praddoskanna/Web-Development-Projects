const main = async() =>{
    
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.deploy("eth");
    await domainContract.deployed();
    console.log("Contract deployed to :",domainContract.address);

    // Let's be extra generous with our payment (we're paying more than required)
  let txn = await domainContract.register("a16z",  {value: hre.ethers.utils.parseEther('1234')});
  await txn.wait();

  // How much money is in here?
  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  // Quick! Grab the funds from the contract! (as superCoder)
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch(error){
    console.log("Could not rob contract");
  }

  // Let's look in their wallet so we can compare later
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  // Oops, looks like the owner is saving their money!
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();
  
  // Fetch balance of contract & owner
  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
}
    
    // let txn = await domainContract.register("mortal",{value:hre.ethers.utils.parseEther('0.1')});
    // await txn.wait();

    // const domainOwner = await domainContract.getAddress("mortal");
    // console.log("Owner of domain:", domainOwner);

    // const balance = await hre.ethers.provider.getBalance(domainContract.address);
    // console.log("CONTRACT BALANCE : ", hre.ethers.utils.formatEther(balance));
    // txn = await domainContract.connect(randomPerson).setRecord("doom","My Domain is Doom");
    // await txn.wait();
// };

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