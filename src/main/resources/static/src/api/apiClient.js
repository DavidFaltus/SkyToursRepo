import { getState, dispatch } from '../store/state.js';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * IR03: Asynchronní operace s API
 * Centrální wrapper nad Fetch API pro komunikaci s backendem (PRO2).
 * Řeší i vkládání JWT tokenu pro autentizované routy.
 */
export const apiClient = async (endpoint, options = {}) => {
    const state = getState();
    const token = state.user.token;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Pokud máme token, přidáme ho do hlavičky Authorization
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
            // Pokud přijde 401 Unauthorized - token expiroval nebo uživatel není autentizován
            if (response.status === 401) {
                // Pouze se odhlasit, pokud jsme měli token a voláme chráněný endpoint (ne registraci/login)
                if (token && !endpoint.includes('/auth')) {
                    // Měli jsme token, ale je neplatný/vypršel
                    dispatch('LOGOUT');
                    alert("Platnost vašeho přihlášení vypršela. Přihlaste se prosím znovu.");
                } else if (!token && endpoint.includes('/cart')) {
                    // Pro cart bez tokenu je to normální - vrací se 401
                    throw new Error(`Pro přístup k nákupnímu košíku se musíte přihlásit.`);
                }
                throw new Error(`Autentizace selhala (401): Přihlaste se prosím.`);
            }
            
            // Pokud přijde 403 Forbidden - uživatel není oprávněn k tomuto endpointu
            if (response.status === 403) {
                throw new Error(`Přístup odepřen (403). Nemáte oprávnění k tomuto zdroji.`);
            }

            const errorText = await response.text();
            throw new Error(errorText || `API chyba: ${response.status}`);
        }

        // Některé endpointy (např. createReservation) vrací jen string, ne JSON
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