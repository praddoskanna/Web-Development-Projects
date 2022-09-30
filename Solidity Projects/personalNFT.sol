contract PrideElixer is ERC721A, Ownable, ReentrancyGuard {

    using Strings for uint256;

    
    //File type
    string public uriSuffix = '.json';
    
    //Prices
    uint256 public cost = 0.005 ether;
    uint256 public whitelistCost = 0.00 ether;
    
    //Inventory
    bytes32 private whitelistRoot;
    string public baseURI;
    uint256 public publicSupply = 3000;
    uint256 public whiteListSupply = 3869;
    uint256 public RESERVE_SUPPLY = 100;

    //limits
    uint256 public maxMintAmountPerWallet = 3;
    uint256 public maxMintAmountPerWhitelist = 3;

    //keep track of counts
    uint256 public reserveMinted;
    uint256 public minted;
    uint256 public whitelistMinted;
    
    //Utility
    bool public paused = true;
    bool public whiteListingSale = true;

    //mapping
    mapping(address => uint256) public addressMintedBalance;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _publicSupply,
        uint256 _whiteListSupply,
        uint256 _maxMintAmountPerWallet,
        uint256 _maxMintAmountPerWhitelist,
        string memory _initialURI

        
    ) ERC721A(_tokenName, _tokenSymbol) {
        //set publicSupply supply amount 
        setPublicSupply(_publicSupply);
         //set whiteListSupply supply amount 
        setWhiteListSupply(_whiteListSupply);
        //set max mint amount per transcation (per wallet)
        setMaxMintAmountPerWallet(_maxMintAmountPerWallet);
        setMaxMintAmountPerWhitelist(_maxMintAmountPerWhitelist);
        //set initial URI
        baseURI = _initialURI;
    }
 
 // =============================================================================//

    /**
     * Do not allow calls from other contracts.
     */
    modifier noBots() {
            require(msg.sender == tx.origin, "Pride: No bots");
            _;
        }
    

  /**
     * Ensure amount of per wallet is within the mint limit.
     * Ensure amount of tokens to mint is within the limit.
     */
    modifier mintLimitCompliance(uint256 _mintAmount) {
      require(_mintAmount > 0, 'Mint amount should be greater than 0');
      if(whiteListingSale){
        require(addressMintedBalance[msg.sender] + _mintAmount <= maxMintAmountPerWhitelist,
             "Pride: Whitelist sale allowance Exceeded"); 
        require( whitelistMinted + _mintAmount <= whiteListSupply , "Pride :whitelist supply Exceeded"); 
        } 
         require(addressMintedBalance[msg.sender] + _mintAmount <= maxMintAmountPerWallet,
             "Pride: Public sale allowance Exceeds"); 
        require( minted + _mintAmount <= publicSupply , "Pride :Max supply Exceeded"); 


       _;
    }

  /**
    * Set the presale Merkle root.
    * @dev The Merkle root is calculated from [address, allowance] pairs.
    * @param _root The new merkle roo
    */
    function setWhitelistingRoot(bytes32 _root) public onlyOwner {
            whitelistRoot = _root;
    }


  /**
    * Verify the Merkle proof is valid.
    * @param _leafNode The leaf. A [address, availableAmt] pair
    * @param proof The Merkle proof used to validate the leaf is in the root
    */
    function _verify(bytes32 _leafNode, bytes32[] memory proof)
    internal
    view
    returns (bool)
    {
        return MerkleProof.verify(proof, whitelistRoot, _leafNode);
    }


  /**
    * Generate the leaf node 
    * @param account used the hash of tokenID concatenated with the account address
    */
    function _leaf(address account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(account));
    }


   /**
     * Mint tokens during the presale.
     * @notice This function is only available to those on the allowlist.
     * @param _mintAmount The number of tokens to mint.
     * @param proof The Merkle proof used to validate the leaf is in the root.
     */
    function mintWhitelist(bytes32[] calldata proof, uint256 _mintAmount)
        external
        payable
        noBots
        mintLimitCompliance(_mintAmount)
    {
         require(!paused);
         require(whiteListingSale, "Pride: Whitelisting not enabled");
         require(_verify(_leaf(msg.sender), proof), "Pride: Invalid proof"); 
         require(msg.value >= whitelistCost * _mintAmount, "Pride: Insuffient funds ");
         _mintLoop(msg.sender, _mintAmount);
         whitelistMinted += _mintAmount;
         addressMintedBalance[msg.sender] += _mintAmount; 
    }



   /**
    * Public mint.
    * @param _mintAmount Amount of tokens to mint.
    */
    function mint(uint256 _mintAmount) 
      external 
      payable
      noBots
      mintLimitCompliance(_mintAmount)
    {
        require(!paused, 'The contract is paused!');
        require(!whiteListingSale, "You cant mint on Presale");
          //Reamaining whitelist ill be free for public
           uint256 a = whiteListSupply - whitelistMinted;
             if(whitelistMinted > a) {
                //not free 
                  require(msg.value >= cost * _mintAmount, "Insuffient funds");
                  minted +=_mintAmount;
            }else{

                if(whitelistMinted + _mintAmount > whiteListSupply){
                   uint256 c = _mintAmount - a; 
                   //pay only for c 
                    require(msg.value >= cost * c, "Insuffient funds");
                     
                     minted += c;
                     whitelistMinted += a;
                    
                }else{

                    whitelistMinted += _mintAmount;
                }

            }
        _mintLoop(msg.sender, _mintAmount);
        addressMintedBalance[msg.sender] += _mintAmount;
        
    }


   /**
    * airdrop mint.
    * @param _mintAmount Amount of tokens to mint.
    * @param _receiver Address to mint to.
    */
    function mintForAddress(uint256 _mintAmount, address _receiver)
     external
     onlyOwner
   {
        require(_mintAmount > 0, 'Mint amount should be greater than 0');
        uint256 maxSupply = publicSupply + RESERVE_SUPPLY + whiteListSupply;
        require( totalSupply() + _mintAmount <= maxSupply , "Pride :Max supply Exceeded"); 
        _mintLoop(_receiver, _mintAmount);
        minted += _mintAmount;       
   }


  /**
    * Team reserved mint.
    * @param to Address to mint to.
    * @param quantity Amount of tokens to mint.
    */
    function mintReserved(address to, uint256 quantity)
     external
     onlyOwner
    {
        require(reserveMinted + quantity <= RESERVE_SUPPLY, "Pride: Reseve supply Exceeded");
        _mintLoop(to, quantity);
        reserveMinted += quantity;

    }

  /**
    * Check what are the token ids owned by wallet address
    * @param _owner account address.
    */
  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
    uint256 maxSupply = publicSupply + RESERVE_SUPPLY + whiteListSupply;
    uint256 currentTokenId = 1;
    uint256 ownedTokenIndex = 0;

    while (ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply) {
      address currentTokenOwner = ownerOf(currentTokenId);

      if (currentTokenOwner == _owner) {
        ownedTokenIds[ownedTokenIndex] = currentTokenId;

        ownedTokenIndex++;
      }

      currentTokenId++;
    }

    return ownedTokenIds;
  }


  /**
    * Change the starting tokenId to 1.
    */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }


  /**
    * Change the baseURI
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
  

  /**
    * @dev See {IERC721Metadata-tokenURI}.
    */
    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), uriSuffix))
            : '';
    }


  /**
    * Update whitelist token price
    * @param _cost The new token price
    */
    function setWhitelistCost(uint256 _cost) public onlyOwner {
        whitelistCost = _cost;
    }
  
  
  /**
    * Update token price.
    * @param _cost The new token price
    */
    function setCost(uint256 _cost) public onlyOwner {
        cost = _cost;
    }


  /**
    * Update team supply
    * @param _supply The new token price
    */
    function setReserveSpply(uint256 _supply) public onlyOwner {
        RESERVE_SUPPLY = _supply;
    }


  /**
    * Update colletion publicSupply.
    * @param _supply The new token price
    */
    function setPublicSupply(uint256 _supply) public onlyOwner {
        publicSupply = _supply;
    }

  /**
    * Update colletion publicSupply.
    * @param _supply The new token price
    */
    function setWhiteListSupply(uint256 _supply) public onlyOwner {
        whiteListSupply = _supply;
    }    


  /**
    * Update whilist mint limit per wallet.
    * @param _maxMintAmountPerWhitelist The new token price
    */
    function setMaxMintAmountPerWhitelist(uint256 _maxMintAmountPerWhitelist) public onlyOwner {
        maxMintAmountPerWhitelist = _maxMintAmountPerWhitelist;
    }    


  /**
    * Update sales mint limit per wallet.
    * @param _maxMintAmountPerWallet The new token price
    */
    function setMaxMintAmountPerWallet(uint256 _maxMintAmountPerWallet) public onlyOwner {
        maxMintAmountPerWallet = _maxMintAmountPerWallet;
    }


  /**
    * Sets base URI.
    * @param _newBaseURI The base URI
    */
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }


  /**
    * Sets file type.
    * @param _uriSuffix The base URI
    */
    function setUriSuffix(string memory _uriSuffix) public onlyOwner {
        uriSuffix = _uriSuffix;
    }


  /**
    * On and Off public sales.
    */
    function togglePause() public onlyOwner {
            paused = !paused;
    }

  /**
    * On and Off whitlist sale.
    */
    function toggleWhitlist() public onlyOwner {
            whiteListingSale = !whiteListingSale;
    }


  // =============================================================================//

    function _mintLoop(address _receiver, uint256 _mintAmount) internal {
            _safeMint(_receiver, _mintAmount);
    }

    address private constant WALLET_A = 0x9dC7A7D3c4FD55FaC37f62BA311E9759F142c525;

  
    function withdraw() public onlyOwner nonReentrant {
        
        uint256 balance = address(this).balance;
        require(balance  > 0,"Not have Eth");
        // splitting the initial sale funds
        //5% of initial sale funds will go the A wallet
        (bool hs, ) = payable(WALLET_A).call{value: balance * 5 / 100}("");
         require(hs, "Failed to send to WALLET_A.");
        // =============================================================================
        // remaining funds ill be go to owner
        // =============================================================================
        (bool os, ) = payable(owner()).call{value: balance}('');
        require(os,"Failed to send to owner wallet.");
        // =============================================================================
   }
}
