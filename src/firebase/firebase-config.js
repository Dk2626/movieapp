import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBVlX5njfmrIpIlV-NuZjB7-79_hstOn4Y',
  authDomain: 'mvapp-ec3ca.firebaseapp.com',
  projectId: 'mvapp-ec3ca',
  storageBucket: 'mvapp-ec3ca.appspot.com',
  messagingSenderId: '939878459819',
  appId: '1:939878459819:web:a8a72ed725b5576c8f4aee',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
