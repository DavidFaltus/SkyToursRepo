import { getState, dispatch } from '../store/state.js';

const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = async (endpoint, options = {}) => {
    const state = getState();
    const token = state.user.token;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Pokud máme token v aplikaci, vložíme ho do hlavičky Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log(`[API Client] Odesílám token pro endpoint: ${endpoint}`);
    } else {
        console.log(`[API Client] Žádný token pro endpoint: ${endpoint}`);
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            if (response.status === 401) {
                if (token && !endpoint.includes('/auth')) {
                    dispatch('LOGOUT');
                    alert("Platnost vašeho přihlášení vypršela. Přihlaste se prosím znovu.");
                } else if (!token && endpoint.includes('/cart')) {
                    throw new Error(`Pro přístup k nákupnímu košíku se musíte přihlásit.`);
                }
                throw new Error(`Autentizace selhala (401): Přihlaste se prosím.`);
            }
            
            if (response.status === 403) {
                throw new Error(`Přístup odepřen (403). Nemáte oprávnění k tomuto zdroji.`);
            }

            let errorText = await response.text();
            throw new Error(errorText || `API chyba: ${response.status}`);
        }

        // Některé endpointy vrací jen string, ne JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error(`[API Client] Chyba při volání ${endpoint}:`, error);
        throw error;
    }
};
