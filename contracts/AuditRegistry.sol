pragma solidity ^0.8.19;

contract AuditRegistry {
    address public admin;
    
    struct AuditReport {
        uint256 id;
        string systemName;
        string reportHash; // Hash IPFS del reporte de vulnerabilidades/firewall
        uint256 timestamp;
        address auditor;
    }

    uint256 public reportCount = 0;
    mapping(uint256 => AuditReport) public reports;
    mapping(address => bool) public authorizedAuditors;

    // Eventos
    event ReportFiled(uint256 id, string systemName, address auditor);
    event AuditRequested(string systemName, address requester, uint256 amountPaid);

    // 5. Validación de roles/permisos con require
    modifier onlyAdmin() {
        require(msg.sender == admin, "Acceso denegado: Solo el administrador.");
        _;
    }

    modifier onlyAuditor() {
        require(authorizedAuditors[msg.sender], "Acceso denegado: Solo auditores autorizados.");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedAuditors[msg.sender] = true; // El admin es auditor por defecto
    }

    function addAuditor(address _auditor) public onlyAdmin {
        authorizedAuditors[_auditor] = true;
    }

    // 2. Uso correcto de las funciones de Blockchain (Escritura inmutable)
    function fileReport(string memory _systemName, string memory _reportHash) public onlyAuditor {
        reportCount++;
        reports[reportCount] = AuditReport(reportCount, _systemName, _reportHash, block.timestamp, msg.sender);
        emit ReportFiled(reportCount, _systemName, msg.sender);
    }

    // 3. Función que recibe un pago en criptomonedas
    // Las empresas pueden pagar para solicitar una auditoría de seguridad prioritaria
    function requestPriorityAudit(string memory _systemName) public payable {
        require(msg.value >= 0.01 ether, "El pago minimo es de 0.01 ETH.");
        emit AuditRequested(_systemName, msg.sender, msg.value);
    }

    // Función de solo lectura (gratuita)
    function getReport(uint256 _id) public view returns (string memory, string memory, uint256, address) {
        require(_id > 0 && _id <= reportCount, "Reporte no existe.");
        AuditReport memory r = reports[_id];
        return (r.systemName, r.reportHash, r.timestamp, r.auditor);
    }
}
