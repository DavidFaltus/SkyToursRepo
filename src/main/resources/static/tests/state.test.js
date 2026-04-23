import { getState, dispatch, subscribe } from '../src/store/state.js';

describe('State Management', () => {
  beforeEach(() => {
    // Před každým testem vyčistíme localStorage a resetneme stav
    localStorage.clear();
    dispatch('LOGOUT');
    dispatch('CLEAR_CART');
    dispatch('NAVIGATE', { route: 'home' });
  });

  // Testuje, že se globální stav po spuštění správně inicializuje do výchozích hodnot.
  test('Mel by se inicializovat se spravnym vychozim stavem', () => {
    const state = getState();
    expect(state.ui.currentRoute).toBe('home');
    expect(state.cart.items).toEqual([]);
    expect(state.user.isAuthenticated).toBe(false);
  });

  // Testuje akci NAVIGATE a ověřuje změnu aktuální zobrazené cesty.
  test('Akce NAVIGATE by mela zmenit aktualni routu', () => {
    dispatch('NAVIGATE', { route: 'cart' });
    const state = getState();
    expect(state.ui.currentRoute).toBe('cart');
  });

  // Testuje úspěšné přihlášení uživatele pomocí akce LOGIN_SUCCESS a uložení jeho dat do stavu.
  test('Akce LOGIN_SUCCESS by mela nastavit uzivatele a autentizaci', () => {
    const mockUser = {
      token: 'fake-jwt-token',
      username: 'testUser',
      role: 'ROLE_USER'
    };

    dispatch('LOGIN_SUCCESS', mockUser);

    const state = getState();
    expect(state.user.isAuthenticated).toBe(true);
    expect(state.user.username).toBe('testUser');
    expect(state.user.token).toBe('fake-jwt-token');
  });

  // Testuje akci LOGOUT a potvrzuje, že jsou všechna uživatelská data ze stavu smazána.
  test('Akce LOGOUT by mela vycistit uzivatelska data', () => {
    dispatch('LOGIN_SUCCESS', { token: '123', username: 'test', role: 'USER' });
    dispatch('LOGOUT');

    const state = getState();
    expect(state.user.isAuthenticated).toBe(false);
    expect(state.user.username).toBe(null);
    expect(state.user.token).toBe(null);
  });

  // Testuje správu nákupního košíku přes akce SET_CART a CLEAR_CART.
  test('Akce SET_CART a CLEAR_CART by mely spravovat kosik', () => {
    const mockItems = [{ id: 1, tripName: 'Let balonem', quantity: 2 }];

    dispatch('SET_CART', { items: mockItems });
    let state = getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].tripName).toBe('Let balonem');

    dispatch('CLEAR_CART');
    state = getState();
    expect(state.cart.items).toHaveLength(0);
  });

  // Testuje volání callbacku po odeslání akce.
  test('Subscribe funkce by mela zavolat callback pri zmene stavu', () => {
    const mockListener = jest.fn();
    subscribe(mockListener);

    dispatch('NAVIGATE', { route: 'profile' });

    expect(mockListener).toHaveBeenCalled();
  });
});
