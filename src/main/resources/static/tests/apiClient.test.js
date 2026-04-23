import { apiClient } from '../src/api/apiClient.js';
import { dispatch } from '../src/store/state.js';

// Mockování funkce dispatch ze state.js
jest.mock('../src/store/state.js', () => {
    const originalModule = jest.requireActual('../src/store/state.js');
    return {
        ...originalModule,
        dispatch: jest.fn()
    };
});

describe('API Client', () => {
    beforeEach(() => {
        // Reset mocků před každým testem
        jest.clearAllMocks();
        localStorage.clear();
        global.fetch = jest.fn();
        global.alert = jest.fn();
    });

    // Testuje úspěšné volání API přes metodu GET a správné zpracování navrácených JSON dat.
    test('Mel by provest uspesny GET pozadavek a vratit JSON', async () => {
        const mockData = { id: 1, name: 'Let balonem' };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => mockData
        });

        const result = await apiClient('/trips');

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/trips',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
        expect(result).toEqual(mockData);
    });

    // Testuje, zda apiClient správně přidává Authorization hlavičku s Bearer tokenem, pokud je uživatel přihlášený.
    test('Mel by odeslat Authorization hlavicku, pokud je uzivatel prihlasen', async () => {
        // Nasimulování přihlášeného uživatele v localStorage (které state.js načte)
        localStorage.setItem('jwt', 'fake-jwt-token');

        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({})
        });

        // Pro správný test musíme state.js reálně uvést do přihlášeného stavu
        const stateModule = jest.requireActual('../src/store/state.js');
        stateModule.dispatch('LOGIN_SUCCESS', { token: 'fake-jwt-token', username: 'test', role: 'USER' });

        await apiClient('/cart');

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/cart',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'Bearer fake-jwt-token'
                })
            })
        );
    });

    // Testuje reakci klienta na chybu autentizace (401) – zachycení chyby a automatické odhlášení uživatele.
    test('Mel by vyhodit chybu a pripadne odhlasit pri 401 Unauthorized', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: async () => 'Unauthorized'
        });

        const stateModule = jest.requireActual('../src/store/state.js');
        stateModule.dispatch('LOGIN_SUCCESS', { token: 'fake-jwt-token', username: 'test', role: 'USER' });

        await expect(apiClient('/some-protected-route')).rejects.toThrow('Autentizace selhala (401)');

        expect(dispatch).toHaveBeenCalledWith('LOGOUT');
    });
});
