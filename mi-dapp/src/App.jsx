import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AuditRegistryABI from './AuditRegistryABI.json'; // El ABI del contrato compilado
import './App.css';

const contractAddress = "0xC469e7aE4aD962c30c7111dc580B4adbc7E914DD";

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
        <div className="app-container">

            <header className="app-header">

                <div className="brand">
                    <h1 className="main-title">
                        DApp
                    </h1>

                    <p className="subtitle">
                        Registro de Auditorías de Ciberseguridad
                    </p>
                </div>

                <div className="wallet-area">

                    {account ? (
                        <>
                            <span className="wallet-status">
                                Conectado: {account.substring(0, 6)}...
                                {account.substring(38)}
                            </span>

                            <button
                                className="btn btn-secondary"
                                onClick={disconnectWallet}
                            >
                                Desconectar
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={connectWallet}
                        >
                            Conectar Wallet (MetaMask)
                        </button>
                    )}

                </div>

            </header>

            {isReadOnly && (
                <div className="readonly-notice">

                    <strong>
                        Modo de solo lectura
                    </strong>

                    <p>
                        Estás viendo el registro público de auditorías.
                        Conecta tu wallet para solicitar nuevas auditorías.
                    </p>

                </div>
            )}

            <main className="dashboard">

                <section className="content-card">

                    <h2>
                        Sistemas Auditados
                    </h2>

                    <p className="section-description">
                        Registro inmutable de auditorías almacenadas en Blockchain.
                    </p>

                    {reports.length > 0 ? (

                        <div className="reports-list">

                            {reports.map((rep, index) => (

                                <div className="report-item" key={index}>

                                    <strong>
                                        {rep[0]}
                                    </strong>

                                    <span>
                                        Hash del reporte: {rep[1]}
                                    </span>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="empty-message">
                            No hay reportes registrados todavía.
                        </p>

                    )}

                </section>

                <section className="content-card">

                    <h2>
                        Solicitar Auditoría Prioritaria
                    </h2>

                    <p className="section-description">
                        Solicita una auditoría prioritaria mediante un pago en ETH.
                    </p>

                    <div className="payment-area">

                        <div>

                            <span className="payment-label">
                                Costo de solicitud
                            </span>

                            <strong className="payment-amount">
                                0.01 ETH
                            </strong>

                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => requestAudit("Servidor Web GNS3")}
                            disabled={isReadOnly}
                        >
                            Pagar y solicitar auditoría
                        </button>

                    </div>

                </section>

            </main>

            <footer className="app-footer">
                Plataforma descentralizada de registro de auditorías
            </footer>

        </div>
    );
}
