import './App.css';
import { useEffect, useState } from "react";
import { Contract, providers } from "ethers";

import  NFT  from  "./abi/horoscopeNFT.json";
// import NFT from "./abi/horoscopeNFT.json";

const  NFT_CONTRACT_ADDRESS = "0x6a16D0919B6CCb3D03CAe4BD873d811E3C3Dd6b3";

function App() {

  //State Variables
  //App 
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [date, setDate] = useState("1970-01-01");
  const [zodiacSign, setZodiacSign] = useState(null);
  
  //Contract
  //Funcional
  const [isMinting, setIsMinting] = useState(false);
  const [account, setAccount] = useState(null);
  const [NFTContract, setNFTContract] = useState(null);

 

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);
  
  async function connectWallet() {
    window.ethereum.request({
      method: "eth_requestAccounts",
    }).then((accounts) => {
      setAccount(accounts[0]);
    })
      .catch((error) => {
        alert("Something Went Wrong");
      });
  }

   useEffect(() => {
    calculateZodiacSign(date);
  }, [date]);

  function handleDateInput({ target }) {
    setDate(target.value);
  }


  function calculateZodiacSign(date) {
    let dateObject = new Date(date);
    let day = dateObject.getDate();
    let month = dateObject.getMonth();
    if (month == 0) {
      if (day >= 20) {
        setZodiacSign("Aquarius");
      } else {
        setZodiacSign("Capricorn");
      }
    } else if (month == 1) {
      if (day >= 19) {
        setZodiacSign("Pisces");
      } else {
        setZodiacSign("Aquarius");
      }
    } else if (month == 2) {
      if (day >= 21) {
        setZodiacSign("Aries");
      } else {
        setZodiacSign("Pisces");
      }
    } else if (month == 3) {
      if (day >= 20) {
        setZodiacSign("Taurus");
      } else {
        setZodiacSign("Aries");
      }
    } else if (month == 4) {
      if (day >= 21) {
        setZodiacSign("Gemini");
      } else {
        setZodiacSign("Taurus");
      }
    } else if (month == 5) {
      if (day >= 21) {
        setZodiacSign("Cancer");
      } else {
        setZodiacSign("Gemini");
      }
    } else if (month == 6) {
      if (day >= 23) {
        setZodiacSign("Leo");
      } else {
        setZodiacSign("Cancer");
      }
    } else if (month == 7) {
      if (day >= 23) {
        setZodiacSign("Virgo");
      } else {
        setZodiacSign("Leo");
      }
    } else if (month == 8) {
      if (day >= 23) {
        setZodiacSign("Libra");
      } else {
        setZodiacSign("Virgo");
      }
    } else if (month == 9) {
      if (day >= 23) {
        setZodiacSign("Scorpio");
      } else {
        setZodiacSign("Libra");
      }
    } else if (month == 10) {
      if (day >= 22) {
        setZodiacSign("Sagittarius");
      } else {
        setZodiacSign("Scorpio");
      }
    } else if (month == 11) {
      if (day >= 22) {
        setZodiacSign("Capricorn");
      } else {
        setZodiacSign("Sagittarius");
      }
    }

  }

  useEffect(() => {
    function initNFTContract() {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function mintNFT() {
    setIsMinting(true);
    try {
      await NFTContract.mintNFT(account, zodiacSign);
    } catch (e) {
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
      <div className="App">
        {
          isWalletInstalled ? (<button onClick={connectWallet}>Connect Wallet</button>) : (<p>Install Metamask waller</p>)
        }
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Horoscope NFT Minting Dapp</h1>
      <p > Connected as : {account}</p>
      <input onChange={handleDateInput} value={date} type="date" id="dob"></input>
      <br />
      <br />
      {zodiacSign ? (<svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 300 300"
        width="400px"
        height="400px"
      >
        <style>{`.base { fill: white; font-family: serif; font-size: 24px;`}</style>
        <rect width="100%" height="100%" fill="black" />
        <text
          x="50%"
          y="50%"
          class="base"
          dominant-baseline="middle"
          text-anchor="middle"
        >
          {zodiacSign}
        </text>
      </svg>
      ) : (null)}

      <br />
      <br />

      <button isLoading={isMinting} onClick={mintNFT}> Mint Your Horoscope as NFT</button>

    </div>
  );

}

export default App;
