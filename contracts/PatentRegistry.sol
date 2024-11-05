// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract PatentRegistry {
    // Structs
    struct Patent {
        uint256 id;
        address owner;
        string ipfsHash;
        string title;
        string description;
        uint256 filingDate;
        PatentStatus status;
        string[] keywords;
        uint256 expiryDate;
    }

    struct PatentOfficer {
        bool isActive;
        string name;
        uint256 appointmentDate;
    }

    // Enums
    enum PatentStatus { Pending, UnderReview, Approved, Rejected, Expired }

    // State Variables
    mapping(uint256 => Patent) public patents;
    mapping(address => PatentOfficer) public patentOfficers;
    mapping(address => uint256[]) public userPatents;
    
    uint256 public patentCount;
    address public admin;
    uint256 public constant PATENT_VALIDITY_PERIOD = 10 * 365 days;
    uint256 public FILING_FEE = 0.1 ether;

    // Events
    event PatentFiled(
        uint256 indexed patentId, 
        address indexed owner,
        string title,
        string ipfsHash
    );
    event PatentStatusUpdated(
        uint256 indexed patentId,
        PatentStatus newStatus
    );
    event PatentOfficerAdded(address indexed officer, string name);
    event PatentOfficerRemoved(address indexed officer);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyPatentOfficer() {
        require(patentOfficers[msg.sender].isActive, "Only patent officers can perform this action");
        _;
    }

    modifier validPatentId(uint256 _patentId) {
        require(_patentId > 0 && _patentId <= patentCount, "Invalid patent ID");
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
    }

    // Main Functions
    function filePatent(
        string memory _title,
        string memory _description,
        string memory _ipfsHash,
        string[] memory _keywords
    ) external payable {
        require(msg.value == FILING_FEE, "Incorrect filing fee");
        
        patentCount++;
        
        Patent storage newPatent = patents[patentCount];
        newPatent.id = patentCount;
        newPatent.owner = msg.sender;
        newPatent.title = _title;
        newPatent.description = _description;
        newPatent.ipfsHash = _ipfsHash;
        newPatent.filingDate = block.timestamp;
        newPatent.status = PatentStatus.Pending;
        newPatent.keywords = _keywords;
        newPatent.expiryDate = block.timestamp + PATENT_VALIDITY_PERIOD;

        userPatents[msg.sender].push(patentCount);

        emit PatentFiled(patentCount, msg.sender, _title, _ipfsHash);
    }

    function updatePatentStatus(
        uint256 _patentId, 
        PatentStatus _newStatus
    ) external onlyPatentOfficer validPatentId(_patentId) {
        require(_newStatus != PatentStatus.Pending, "Cannot set status back to pending");
        patents[_patentId].status = _newStatus;
        
        emit PatentStatusUpdated(_patentId, _newStatus);
    }

    function addPatentOfficer(
        address _officer,
        string memory _name
    ) external onlyAdmin {
        require(!patentOfficers[_officer].isActive, "Officer already exists");
        
        patentOfficers[_officer] = PatentOfficer({
            isActive: true,
            name: _name,
            appointmentDate: block.timestamp
        });

        emit PatentOfficerAdded(_officer, _name);
    }

    function removePatentOfficer(address _officer) external onlyAdmin {
        require(patentOfficers[_officer].isActive, "Officer does not exist");
        patentOfficers[_officer].isActive = false;
        
        emit PatentOfficerRemoved(_officer);
    }

    // View Functions
    function getPatent(uint256 _patentId) external view 
        validPatentId(_patentId) returns (Patent memory) {
        return patents[_patentId];
    }

    function getUserPatents(address _user) external view returns (uint256[] memory) {
        return userPatents[_user];
    }

    function isPatentOfficer(address _address) external view returns (bool) {
        return patentOfficers[_address].isActive;
    }

    // Admin Functions
    function withdrawFees() external onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }

    function updateFilingFee(uint256 _newFee) external onlyAdmin {
        FILING_FEE = _newFee;
    }
}