import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
  getDataConnect,
  connectDataConnectEmulator,
} from 'firebase/data-connect';
import { connectorConfig } from 'dataconnect-generated/js/default-connector';
import { environment } from '../environments/environment';

const firebaseConfig = environment.firebase;

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Configurar Auth con emulador
export const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:9099');

// Configurar DataConnect con emulador
export const dataConnect = getDataConnect(connectorConfig);
// Forzar el uso del emulador local
connectDataConnectEmulator(dataConnect, 'localhost', 9399);

// Verificar que DataConnect está configurado correctamente
console.log('DataConnect inicializado y configurado con emulador local');

console.log('Firebase inicializado con emuladores configurados');
