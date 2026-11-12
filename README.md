**PIA de Aplicaciones Basadas en Cadenas de Bloques**

---

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una Aplicación Descentralizada (DApp) enfocada en gestionar un registro inmutable de auditorías de ciberseguridad mediante tecnología Blockchain.

La aplicación permite consultar los reportes almacenados en la cadena de bloques, gestionar auditores autorizados y solicitar auditorías prioritarias mediante pagos en Ether (ETH).

### Características principales

- **Transparencia:** Cualquier usuario puede consultar los reportes de auditoría registrados en la Blockchain.
- **Inmutabilidad:** Los reportes se almacenan mediante un Smart Contract, conservando su información en la cadena de bloques.
- **Control de acceso:** Únicamente las wallets autorizadas pueden registrar nuevos reportes.
- **Gestión de auditores:** El administrador del contrato puede autorizar nuevas direcciones de wallet.
- **Auditorías prioritarias:** Los usuarios pueden solicitar una auditoría prioritaria mediante un pago mínimo de 0.01 ETH.
- **Integración con MetaMask:** Permite conectar una wallet para interactuar con el Smart Contract.
- **Interfaz gráfica:** Cuenta con una interfaz desarrollada con React y CSS, utilizando un diseño profesional inspirado en los colores de MetaMask.

---

## Tecnologías Utilizadas

| Tecnología | Función |
|---|---|
| Solidity | Desarrollo del Smart Contract |
| Hardhat 3 | Entorno de desarrollo y compilación |
| Foundry | Herramientas de pruebas para Solidity |
| React | Desarrollo de la interfaz |
| Vite | Servidor de desarrollo del frontend |
| Ethers.js 5 | Comunicación entre React y Blockchain |
| MetaMask | Conexión y firma de transacciones |
| Remix IDE | Compilación y despliegue del contrato |
| Git y GitHub | Control de versiones y almacenamiento del proyecto |

---

## Requisitos Previos

Para ejecutar el proyecto se necesitan las siguientes herramientas:

1. **Node.js y npm:** Para instalar y ejecutar las dependencias.
2. **MetaMask:** Extensión del navegador para conectar una wallet.
3. **Git:** Para clonar y administrar el repositorio.
4. **Remix IDE:** Para compilar y desplegar el Smart Contract.
5. **Hardhat:** Para ejecutar una Blockchain local.
6. **Foundry:** Para disponer de herramientas adicionales de desarrollo y pruebas de Solidity.

---

## Instrucciones de Instalación y Ejecución

### Paso 1. Clonar el repositorio

Clona el proyecto desde GitHub:

```bash
git clone https://github.com/karlXcrz/PIA-ABCB.git
```

Entra a la carpeta:

```bash
cd PIA-ABCB
```

Instala las dependencias principales:

```bash
npm install
```

Después entra a la carpeta del frontend:

```bash
cd mi-dapp
```

Instala las dependencias de React:

```bash
npm install
```

Regresa a la raíz del proyecto:

```bash
cd ..
```

### Paso 2. Inicializar el submódulo de Foundry

El proyecto utiliza `forge-std` como submódulo de Git.

Para descargarlo correctamente ejecuta:

```bash
git submodule update --init --recursive
```

### Paso 3. Iniciar la Blockchain local

Desde la carpeta raíz del proyecto ejecuta:

```bash
npx hardhat node --hostname 0.0.0.0
```

Hardhat iniciará una Blockchain local y mostrará diferentes cuentas de prueba con sus respectivas llaves privadas.

**Importante:** Mantén esta terminal abierta mientras utilizas la aplicación.

Las cuentas y llaves generadas por Hardhat son exclusivamente para pruebas locales. No deben utilizarse con fondos reales.

### Paso 4. Configurar MetaMask

Abre MetaMask y agrega una red personalizada con los siguientes datos:

| Parámetro | Valor |
|---|---|
| Nombre de la red | Hardhat Local |
| URL RPC | http://127.0.0.1:8545 |
| ID de cadena | 31337 |
| Símbolo de moneda | ETH |

Si MetaMask se utiliza desde otro equipo o desde Windows mientras Kali Linux ejecuta Hardhat en una máquina virtual, se debe utilizar la dirección IP accesible de la máquina virtual en lugar de `127.0.0.1`.

Para realizar pruebas, importa una de las cuentas de prueba proporcionadas por Hardhat.

### Paso 5. Desplegar el Smart Contract

El contrato principal es `AuditRegistry.sol`.

Para desplegarlo utilizando Remix IDE:

1. Abre [Remix IDE](https://remix.ethereum.org/).
2. Carga el código del contrato `AuditRegistry.sol`.
3. Selecciona la versión de Solidity compatible con el contrato.
4. Compila el contrato.
5. Configura el entorno de despliegue para utilizar la Blockchain local de Hardhat.
6. Conecta MetaMask si el entorno de despliegue lo requiere.
7. Ejecuta el despliegue.
8. Copia la dirección del contrato desplegado.

### Paso 6. Configurar el Frontend

Abre el archivo `mi-dapp/src/App.jsx`.

Localiza la variable:

```javascript
const contractAddress = "TU_DIRECCION_DEL_CONTRATO";
```

Sustituye el valor por la dirección del contrato que hayas desplegado.

También verifica que `mi-dapp/src/AuditRegistryABI.json` contenga el ABI correspondiente al contrato desplegado.

**Nota:** La dirección del contrato depende del despliegue y de la instancia de Blockchain utilizada. Si se reinicia el nodo local de Hardhat, será necesario desplegar nuevamente el contrato y actualizar su dirección.

### Paso 7. Ejecutar la aplicación

Abre una segunda terminal y entra a la carpeta del frontend:

```bash
cd ~/PIA-ABCB/mi-dapp
```

Inicia el servidor de desarrollo:

```bash
npm run dev -- --host 0.0.0.0
```

Abre en el navegador la dirección proporcionada por Vite, normalmente:

```text
http://localhost:5173
```

Conecta MetaMask utilizando la red Hardhat Local.

---

## Funcionalidades del Smart Contract

El contrato `AuditRegistry.sol` contiene las siguientes funciones principales:

| Función | Descripción |
|---|---|
| `addAuditor(address)` | Autoriza una dirección de wallet como auditor. |
| `fileReport(string,string)` | Registra un reporte de auditoría. |
| `getReport(uint256)` | Consulta la información de un reporte. |
| `requestPriorityAudit(string)` | Permite solicitar una auditoría prioritaria mediante un pago mínimo de 0.01 ETH. |
| `reportCount()` | Consulta la cantidad de reportes registrados. |
| `authorizedAuditors(address)` | Comprueba si una wallet está autorizada. |
| `admin()` | Consulta la dirección del administrador. |

### Roles del sistema

**Administrador:**
- Puede autorizar nuevos auditores.
- Tiene permisos para administrar las autorizaciones.

**Auditor autorizado:**
- Puede registrar nuevos reportes de auditoría.

**Usuario:**
- Puede consultar los reportes públicos.
- Puede solicitar una auditoría prioritaria mediante el pago correspondiente.

---

## Diseño de la Interfaz

La interfaz gráfica fue desarrollada con React y CSS.

Se implementó un diseño orientado a computadoras de escritorio, con una apariencia profesional y una paleta de colores inspirada en MetaMask.

Entre sus elementos visuales destacan:

- Título principal DApp con tipografía Playfair Display.
- Tipografía Inter para mejorar la legibilidad.
- Tonalidades azules, blancas y naranjas.
- Tarjetas independientes para organizar las funcionalidades.
- Indicador de conexión de MetaMask.
- Visualización de reportes registrados.
- Sección para solicitar auditorías prioritarias.
- Adaptación de la distribución para pantallas más pequeñas.

---

## Solución de Problemas (Troubleshooting)

### Error: Nonce too high

Puede ocurrir cuando se reinicia el nodo de Hardhat y MetaMask conserva información de transacciones anteriores.

Solución:

1. Abre MetaMask.
2. Selecciona la cuenta utilizada en Hardhat Local.
3. Entra a Configuración.
4. Busca la opción para borrar los datos de actividad y nonce de la cuenta en esa red.
5. Vuelve a intentar la transacción.

### Error: Contrato no encontrado

Puede ocurrir si se reinició la Blockchain local o si se está utilizando una dirección de contrato anterior.

Solución:

1. Inicia nuevamente el nodo de Hardhat.
2. Despliega otra vez `AuditRegistry.sol`.
3. Copia la nueva dirección.
4. Actualiza `contractAddress` en `App.jsx`.

### Error: MetaMask no conecta

Comprueba que:

- MetaMask esté instalado y habilitado.
- El nodo local de Hardhat esté ejecutándose.
- La URL RPC sea correcta.
- La red tenga el ID de cadena 31337.
- La wallet esté conectada a la red Hardhat Local.

### Error: Dependencias o módulos no encontrados

Desde la raíz del proyecto ejecuta:

```bash
npm install
```

Después, dentro de `mi-dapp`:

```bash
npm install
```

Si falta el submódulo de Foundry:

```bash
git submodule update --init --recursive
```

---
