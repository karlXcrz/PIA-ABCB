
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AuditRegistryABI from './AuditRegistryABI.json';
import './App.css';

const contractAddress = "AQUI INSTERTAMOS LA DIRECCIÓN DEL CONTRATO";

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
            loadPublicData();
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsReadOnly(false);
                loadPublicData();
            }
        } catch (error) {
            console.error("El usuario rechazó la conexión.");
            setIsReadOnly(true);
            loadPublicData();
        }
    };

    const loadPublicData = async () => {
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
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, AuditRegistryABI, signer);

        try {
            const tx = await contract.requestPriorityAudit(systemName, {
                value: ethers.utils.parseEther("0.01")
            });
            await tx.wait();
            alert("Solicitud y pago procesados con éxito.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="app-container">
            <div className="app-content">

                <header className="app-header">
                    <div className="header-title">
                        <h1>Registro de Auditorías</h1>
                        <p>Plataforma de Auditorías de Ciberseguridad</p>
                    </div>

                    <div className="wallet-container">
                        {account ? (
                            <>
                                <span className="wallet-address">
                                    Conectado: {account.substring(0,6)}...{account.substring(38)}
                                </span>
                                <button
                                    className="button button-secondary"
                                    onClick={disconnectWallet}
                                >
                                    Desconectar
                                </button>
                            </>
                        ) : (
                            <button
                                className="button button-primary"
                                onClick={connectWallet}
                            >
                                Conectar Wallet (MetaMask)
                            </button>
                        )}
                    </div>
                </header>

                {isReadOnly && (
                    <div className="readonly-alert">
                        <strong>Modo de Solo Lectura</strong>
                        <p>
                            Estás viendo el registro público de auditorías.
                            Conecta tu wallet para solicitar nuevas auditorías o registrar reportes.
                        </p>
                    </div>
                )}

                <section className="content-card">
                    <h2>Sistemas Auditados</h2>
                    <p className="section-description">
                        Registro público e inmutable almacenado en Blockchain.
                    </p>

                    {reports.length > 0 ? (
                        <div className="table-container">
                            <table className="reports-table">
                                <thead>
                                    <tr>
                                        <th>Sistema</th>
                                        <th>Hash del Reporte</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((rep, index) => (
                                        <tr key={index}>
                                            <td>{rep[0]}</td>
                                            <td className="hash-cell">{rep[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-message">
                            No hay reportes registrados para mostrar.
                        </div>
                    )}
                </section>

                <section className="content-card">
                    <h2>Solicitar Auditoría Prioritaria</h2>
                    <p className="section-description">
                        Solicita una auditoría prioritaria para el sistema seleccionado.
                        La operación requiere conectar una wallet y confirmar el pago.
                    </p>

                    <div className="system-selection">
                        <span>Sistema seleccionado</span>
                        <strong>Servidor Web GNS3</strong>
                    </div>

                    <button
                        className="button button-primary audit-button"
                        onClick={() => requestAudit("Servidor Web GNS3")}
                        disabled={isReadOnly}
                    >
                        Pagar 0.01 ETH y Solicitar
                    </button>

                    {isReadOnly && (
                        <p className="disabled-message">
                            Conecta tu wallet para habilitar esta opción.
                        </p>
                    )}
                </section>

                <footer className="app-footer">
                    Registro de Auditorías de Ciberseguridad | DApp Blockchain
                </footer>

            </div>
        </main>
    );
}
