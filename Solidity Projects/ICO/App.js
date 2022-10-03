import { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import './App.css';

import { Tsunami } from "react-bootstrap-icons";
import { Alexa } from "react-bootstrap-icons";




//Setting ABI and Contract Address
import artifact from "./utils/Crowdsale.json";
// import { ethers } from 'hardhat';
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";


function App() {

  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider);

      const contract = await new ethers.Contract(
        CONTRACT_ADDRESS,
        artifact.abi,
        provider)

      setContract(contract);
    }
    onLoad()
  }, []);

  /// Checking METAMASK
  const isConnected = () => (signer !== undefined)


  // Connecting WALLET
  const connect = () => {
    getSigner(provider)
      .then(signer => {
        setSigner(signer)
      })
  }

  // SETTING USER WALLET ADDRESS
  const getSigner = async provider => {
    const signer = provider.getSigner();
    signer.getAddress().then((address) => {
      setSignerAddress(address)
    })
    return signer;
  }

  // convert ether toWEI from user 
  const toWei = ether => ethers.utils.parseEther(ether)

  //buyTokens with the given wei
  const buyTokens = async () => {
    const wei = toWei(amount)
    await contract.connect(signer).buyTokens(signerAddress, { value: wei })
  }




  return (
    <div className="App">
      <header className='App-header'>
        {isConnected() ? (
          <div>
            <p>
              Welcome {signerAddress?.substring(0, 10)}...
            </p>
            <div className='list-group'>
              <div className='list-group-item'>
                <div className='row py-3' >
                  <div className='col-md-2'>
                    <Alexa className='rounded-circle' width="36" height="36" />
                  </div>
                  <div className='col-md-5'>
                    <input className='inputField'
                      placeholder='0.0 ether'
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <div className='d-flex gap-4 col-md-3'>
                    SLV
                  </div>
                  <div className='d-flex gap-4 col-md-2'>
                    <button
                      class="btn btn-success"
                      onClick={() => buyTokens()}>
                      Buy Token
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p> You Wallet is Not Connected. Please Connect your Wallet</p>
          <button onClick={connect} className="btn btn-primary">Connect Metamask</button>
          </div>

        )
        }
      </header>
    </div>
  );
}

export default App;
