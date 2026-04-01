import { apiClient } from './apiClient.js';
import { dispatch } from '../store/state.js';

// LOGINN
export const loginUser = async (username, password) => {
    try {
        const response = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        dispatch('LOGIN_SUCCESS', {
            token: response.token,
            username: response.username,
            role: response.role
        });

        // PŘESMĚROVÁNÍ NA DOMOVSKOU OBRAZOVKU
        dispatch('NAVIGATE', { route: 'home' });

    } catch (error) {
        alert('Přihlášení se nezdařilo. Zkontrolujte jméno a heslo.');
        throw error;
    }
};

// REGISTRACE JAK UŽIVATELE TAK ADMINA
export const registerUser = async (username, email, password, isAdmin) => {
    try {
        const response = await apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, isAdmin })
        });

        dispatch('LOGIN_SUCCESS', {
            token: response.token,
            username: response.username,
            role: response.role
        });
        
        // PŘESMĚROVÁNÍ NA DOMOVSKOU OBRAZOVKU
        dispatch('NAVIGATE', { route: 'home' });

        alert('Registrace a přihlášení byly úspěšné!');
        return response;
    } catch (error) {
        alert('Registrace selhala: ' + error.message);
        throw error;
    }
};