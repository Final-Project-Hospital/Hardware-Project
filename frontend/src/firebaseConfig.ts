// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBFJYSrzujy2-ULdLSe45S9_0gOfrbjeik",
    authDomain: "esp32-environment-sensor.firebaseapp.com",
    databaseURL: "https://esp32-environment-sensor-default-rtdb.firebaseio.com",
    projectId: "esp32-environment-sensor",
    storageBucket: "esp32-environment-sensor.firebasestorage.app",
    messagingSenderId: "635292216798",
    appId: "1:635292216798:web:86a27cc5418e3ec47f414f",
    measurementId: "G-7K1N0N6JPX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
