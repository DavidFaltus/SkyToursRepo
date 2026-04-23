import { renderNavbar } from '../src/components/Navbar.js';
import * as stateStore from '../src/store/state.js';

jest.mock('../src/store/state.js', () => ({
    getState: jest.fn(),
    dispatch: jest.fn()
}));

describe('Navbar Component', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <ul id="nav-menu"></ul>
            <a id="nav-home"></a>
        `;
        jest.clearAllMocks();
    });

    // Testuje správné zobrazení prvků navigace pro nepřihlášeného uživatele.
    test('should render for unauthenticated user', () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [] },
            ui: { currentRoute: 'home' },
            user: { isAuthenticated: false }
        });

        renderNavbar();

        const navMenu = document.getElementById('nav-menu');
        expect(navMenu.innerHTML).toContain('Košík');
        expect(navMenu.innerHTML).toContain('Přihlásit / Registrovat');
        expect(navMenu.innerHTML).not.toContain('Můj profil');
        expect(navMenu.innerHTML).not.toContain('Odhlásit se');
    });

    // Testuje zobrazení prvků navigace pro běžného přihlášeného uživatele.
    test('should render for authenticated user', () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [{ id: 1, quantity: 2 }] },
            ui: { currentRoute: 'cart' },
            user: { isAuthenticated: true, username: 'testuser', role: 'ROLE_USER' }
        });

        renderNavbar();

        const navMenu = document.getElementById('nav-menu');
        expect(navMenu.innerHTML).toContain('Košík <span class="badge bg-primary">2</span>');
        expect(navMenu.innerHTML).toContain('Můj profil');
        expect(navMenu.innerHTML).toContain('Odhlásit se');
        expect(navMenu.innerHTML).toContain('Přihlášen: testuser');
        expect(navMenu.innerHTML).not.toContain('Správa objednávek');
    });

    // Testuje dodatečné zobrazení prvků specifických pro roli admina.
    test('should render admin features for admin user', () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [] },
            ui: { currentRoute: 'home' },
            user: { isAuthenticated: true, username: 'admin', role: 'ROLE_ADMIN' }
        });

        renderNavbar();

        const navMenu = document.getElementById('nav-menu');
        expect(navMenu.innerHTML).toContain('Správa objednávek');
    });

    // Testuje navigaci zpět na domovskou stránku při kliknutí na logo v navigaci.
    test('should dispatch NAVIGATE to home when logo is clicked', () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [] },
            ui: { currentRoute: 'home' },
            user: { isAuthenticated: false }
        });

        renderNavbar();
        document.getElementById('nav-home').click();

        expect(stateStore.dispatch).toHaveBeenCalledWith('NAVIGATE', { route: 'home' });
    });
});
