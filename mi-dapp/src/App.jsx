
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AuditRegistryABI from './AuditRegistryABI.json';

const contractAddress = "AQUI INSTERTAMOS LA DIRECCIÓN DEL CONTRATO";

export default function App() {
    const [account, setAccount] = useState(null);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [reports, setReports] = useState([]);

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

    const connectWallet = async () => {
        checkIfWalletIsConnected();
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsReadOnly(true);
    };

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
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f6fb',
            fontFamily: 'Arial, sans-serif',
            color: '#263445',
            padding: '30px 20px'
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto'
            }}>

                <header style={{
                    backgroundColor: '#ffffff',
                    padding: '25px 30px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px',
                    border: '1px solid #dce4ef',
                    borderTop: '5px solid #2864a8'
                }}>
                    <div>
                        <h1 style={{
                            color: '#24558b',
                            fontSize: '25px',
                            margin: '0 0 8px 0'
                        }}>
                            Registro de Auditorías
                        </h1>
                        <p style={{
                            color: '#68788b',
                            margin: 0,
                            fontSize: '14px'
                        }}>
                            Plataforma de Auditorías de Ciberseguridad
                        </p>
                    </div>

                    {account ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                        }}>
                            <span style={{
                                backgroundColor: '#e8f2ff',
                                color: '#24558b',
                                padding: '10px 14px',
                                borderRadius: '6px',
                                fontSize: '13px'
                            }}>
                                Conectado: {account.substring(0,6)}...{account.substring(38)}
                            </span>
                            <button
                                onClick={disconnectWallet}
                                style={{
                                    backgroundColor: '#e7ebf0',
                                    color: '#35465a',
                                    border: 'none',
                                    padding: '11px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Desconectar
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            style={{
                                backgroundColor: '#2864a8',
                                color: '#ffffff',
                                border: 'none',
                                padding: '12px 18px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Conectar Wallet (MetaMask)
                        </button>
                    )}
                </header>

                {isReadOnly && (
                    <div style={{
                        backgroundColor: '#fff4e5',
                        border: '1px solid #f0d5a9',
                        borderLeft: '5px solid #e5a13b',
                        color: '#79551f',
                        padding: '16px 20px',
                        marginTop: '20px',
                        borderRadius: '7px',
                        fontSize: '14px',
                        lineHeight: '1.5'
                    }}>
                        <strong>Modo de Solo Lectura</strong>
                        <p style={{ margin: '6px 0 0 0' }}>
                            Estás viendo el registro público de auditorías.
                            Conecta tu wallet para solicitar nuevas auditorías o registrar reportes.
                        </p>
                    </div>
                )}

                <section style={{
                    backgroundColor: '#ffffff',
                    padding: '25px',
                    marginTop: '25px',
                    borderRadius: '10px',
                    border: '1px solid #dce4ef'
                }}>
                    <h2 style={{
                        color: '#24558b',
                        fontSize: '20px',
                        marginTop: 0,
                        marginBottom: '8px'
                    }}>
                        Sistemas Auditados
                    </h2>

                    <p style={{
                        color: '#788797',
                        fontSize: '13px',
                        marginBottom: '20px'
                    }}>
                        Registro público e inmutable almacenado en Blockchain.
                    </p>

                    {reports.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '14px'
                            }}>
                                <thead>
                                    <tr style={{
                                        backgroundColor: '#edf3fa',
                                        color: '#345477',
                                        textAlign: 'left'
                                    }}>
                                        <th style={{ padding: '13px' }}>Sistema</th>
                                        <th style={{ padding: '13px' }}>Hash del Reporte</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((rep, index) => (
                                        <tr key={index} style={{
                                            borderBottom: '1px solid #e5eaf0'
                                        }}>
                                            <td style={{ padding: '14px 13px' }}>
                                                {rep[0]}
                                            </td>
                                            <td style={{
                                                padding: '14px 13px',
                                                color: '#60758c',
                                                wordBreak: 'break-all'
                                            }}>
                                                {rep[1]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{
                            backgroundColor: '#f7f9fc',
                            padding: '25px',
                            textAlign: 'center',
                            borderRadius: '7px',
                            color: '#8794a3',
                            fontSize: '14px'
                        }}>
                            No hay reportes registrados para mostrar.
                        </div>
                    )}
                </section>

                <section style={{
                    backgroundColor: '#ffffff',
                    padding: '25px',
                    marginTop: '25px',
                    borderRadius: '10px',
                    border: '1px solid #dce4ef'
                }}>
                    <h2 style={{
                        color: '#24558b',
                        fontSize: '20px',
                        marginTop: 0
                    }}>
                        Solicitar Auditoría Prioritaria
                    </h2>

                    <p style={{
                        color: '#68788b',
                        fontSize: '14px',
                        lineHeight: '1.6'
                    }}>
                        Solicita una auditoría prioritaria para el sistema seleccionado.
                        La operación requiere conectar una wallet y confirmar el pago.
                    </p>

                    <div style={{
                        backgroundColor: '#f3f6fb',
                        padding: '16px',
                        borderRadius: '7px',
                        marginBottom: '18px'
                    }}>
                        <span style={{
                            color: '#68788b',
                            fontSize: '13px'
                        }}>
                            Sistema seleccionado
                        </span>
                        <p style={{
                            fontWeight: 'bold',
                            margin: '7px 0 0 0',
                            color: '#35465a'
                        }}>
                            Servidor Web GNS3
                        </p>
                    </div>

                    <button
                        onClick={() => requestAudit("Servidor Web GNS3")}
                        disabled={isReadOnly}
                        style={{
                            backgroundColor: isReadOnly ? '#aeb9c6' : '#2864a8',
                            color: '#ffffff',
                            border: 'none',
                            padding: '13px 20px',
                            borderRadius: '6px',
                            cursor: isReadOnly ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}
                    >
                        Pagar 0.01 ETH y Solicitar
                    </button>

                    {isReadOnly && (
                        <p style={{
                            color: '#8794a3',
                            fontSize: '12px',
                            marginTop: '12px',
                            marginBottom: 0
                        }}>
                            Conecta tu wallet para habilitar esta opción.
                        </p>
                    )}
                </section>

                <footer style={{
                    textAlign: 'center',
                    color: '#9aa6b3',
                    fontSize: '12px',
                    padding: '25px 0 10px 0'
                }}>
                    Registro de Auditorías de Ciberseguridad | DApp Blockchain
                </footer>
            </div>
        </div>
    );
}
