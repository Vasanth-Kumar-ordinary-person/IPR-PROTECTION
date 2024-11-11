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
    uint256 public patentCount;
    mapping(address => bool) public patentOfficers;
    address public admin;

    event PatentFiled(uint256 indexed id, address indexed owner, string ipfsHash);
    event PatentApproved(uint256 indexed id, address indexed approvedBy);
    event OfficerAdded(address indexed officer);
    event OfficerRemoved(address indexed officer);

    constructor() {
        admin = msg.sender;
        patentCount = 0;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyOfficer() {
        require(patentOfficers[msg.sender], "Only patent officers can perform this action");
        _;
    }

    function addPatentOfficer(address officer) external onlyAdmin {
        patentOfficers[officer] = true;
        emit OfficerAdded(officer);
    }

    function removePatentOfficer(address officer) external onlyAdmin {
        patentOfficers[officer] = false;
        emit OfficerRemoved(officer);
    }

    function filePatent(string memory ipfsHash) external {
        patentCount++;
        patents[patentCount] = Patent({
            id: patentCount,
            owner: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            isApproved: false,
            approvedBy: address(0)
        });

        emit PatentFiled(patentCount, msg.sender, ipfsHash);
    }

    function approvePatent(uint256 patentId) external onlyOfficer {
        require(patentId <= patentCount, "Patent does not exist");
        require(!patents[patentId].isApproved, "Patent already approved");

        patents[patentId].isApproved = true;
        patents[patentId].approvedBy = msg.sender;

        emit PatentApproved(patentId, msg.sender);
    }

    function getPatent(uint256 patentId) external view returns (Patent memory) {
        require(patentId <= patentCount, "Patent does not exist");
        return patents[patentId];
    }
}
