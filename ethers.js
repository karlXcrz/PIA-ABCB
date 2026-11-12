import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AuditRegistryABI from './AuditRegistryABI.json'; // El ABI de tu contrato compilado

const contractAddress = "0xTuDireccionDelContratoAqui";

export default function App() {
    const [account, setAccount] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [reports, setReports] = useState([]);
    
    // 1. Inicia preguntando si se quiere conectar a la Blockchain
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) {
            console.log("Asegúrate de tener MetaMask instalado.");
            setIsReadOnly(true);
            loadPublicData(); // 2. Mostrar funcionalidad en modo lectura
            return;
        }
        
        try {
            // Solicita al usuario conectarse al cargar
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsReadOnly(false);
                loadPublicData();
            }
        } catch (error) {
            console.error("El usuario rechazó la conexión.");
            // 2. En caso de rechazarlo mostrar funcionalidad sin permitir modificar
            setIsReadOnly(true);
            loadPublicData();
        }
    };

    const loadPublicData = async () => {
        // Conexión de solo lectura usando un proveedor por defecto (sin necesidad de firma)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, AuditRegistryABI, provider);
        
        try {
            const count = await contract.reportCount();
            let loadedReports = [];
            for(let i = 1; i <= count; i++) {
                const report = await contract.getReport(i);
                loadedReports.push(report);
            }
            setReports(loadedReports);
        } catch (error) {
            console.log("Error leyendo datos", error);
        }
    };

    // 3. Botón/Menú para conectar y desconectar la wallet
    const connectWallet = async () => {
        checkIfWalletIsConnected();
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsReadOnly(true);
    };

    // 4. Interacción con el Smart Contract (Escritura / Pago)
    const requestAudit = async (systemName) => {
        if (isReadOnly) return alert("Debes conectar tu wallet para esta acción.");
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(); // Necesario para firmar transacciones
        const contract = new ethers.Contract(contractAddress, AuditRegistryABI, signer);

        try {
            const tx = await contract.requestPriorityAudit(systemName, {
                value: ethers.utils.parseEther("0.01") // 3. Pago en criptomonedas
            });
            await tx.wait();
            alert("Solicitud y pago procesados con éxito.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Registro de Auditorías Ciberseguridad</h1>
                
                {/* 3. Menú de conexión persistente */}
                {account ? (
                    <div>
                        <span>Conectado: {account.substring(0,6)}...{account.substring(38)}</span>
                        <button onClick={disconnectWallet} style={{ marginLeft: '10px' }}>Desconectar</button>
                    </div>
                ) : (
                    <button onClick={connectWallet}>Conectar Wallet (MetaMask)</button>
                )}
            </header>

            {isReadOnly && (
                <div style={{ backgroundColor: '#ffcccc', padding: '10px', marginTop: '10px' }}>
                    <strong>Modo de Solo Lectura:</strong> Estás viendo el registro público de auditorías. Conecta tu wallet para solicitar nuevas auditorías o registrar reportes.
                </div>
            )}

            <section style={{ marginTop: '20px' }}>
                <h2>Sistemas Auditados (Inmutable)</h2>
                <ul>
                    {reports.map((rep, index) => (
                        <li key={index}>Sistema: {rep[0]} | Hash del Reporte: {rep[1]}</li>
                    ))}
                </ul>
            </section>

            <section style={{ marginTop: '20px' }}>
                <h2>Solicitar Auditoría Prioritaria</h2>
                <button 
                    onClick={() => requestAudit("Servidor Web GNS3")} 
                    disabled={isReadOnly}
                >
                    Pagar 0.01 ETH y Solicitar
                </button>
            </section>
        </div>
    );
}
