//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "./Base64.sol";

contract horoscopeNFT is ERC721URIStorage{
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg ="<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";


    constructor() ERC721("HoroScope","HRSCP") {}

    function mintNFT(address receiver, string memory zodiacSign)
        public returns(uint256){

            _tokenIds.increment();

            //SVG Setup
            string memory finalSVG = string(abi.encodePacked(baseSvg,zodiacSign,"</text></svg>"));
            string memory json = Base64.encode(bytes(string(
                abi.encodePacked(
                    '{"name":"',zodiacSign,
                    '","description":"On Chain Zodiac Sign NFTs","attributes":[{"trait_type":"Zodiac Sign","value":"',zodiacSign,
                    '"}],"image":"data:image/svg+xml;base64,',Base64.encode(bytes(finalSVG)), '"}'
                )
            )));

            string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,",json)
            );
            
            
            uint256 newItemId = _tokenIds.current();
            _mint(receiver, newItemId);    
            _setTokenURI(newItemId,finalTokenUri);
            return newItemId; 
    }

}