// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract IPProtection {
    struct Patent {
        uint256 id;
        address owner;
        string ipfsHash;
        uint256 timestamp;
        bool isApproved;
        address approvedBy;
    }
    
    mapping(uint256 => Patent) public patents;
    mapping(address => bool) public patentOfficers;
    uint256 public patentCount;
    address public admin;
    uint256 public constant FILING_FEE = 0.01 ether;
    
    event PatentFiled(uint256 indexed id, address indexed owner, string ipfsHash);
    event PatentApproved(uint256 indexed id, address indexed approvedBy);
    
    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyPatentOfficer() {
        require(patentOfficers[msg.sender], "Only patent officers can perform this action");
        _;
    }
    
    function filePatent(string memory ipfsHash) external payable {
        require(msg.value == FILING_FEE, "Incorrect filing fee");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        uint256 newPatentId = patentCount++;
        patents[newPatentId] = Patent({
            id: newPatentId,
            owner: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            isApproved: false,
            approvedBy: address(0)
        });
        
        emit PatentFiled(newPatentId, msg.sender, ipfsHash);
    }
}