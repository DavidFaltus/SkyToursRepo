import { renderHomeView } from '../src/views/HomeView.js';
import * as stateStore from '../src/store/state.js';

jest.mock('../src/store/state.js', () => ({
    getState: jest.fn(),
    dispatch: jest.fn()
}));
jest.mock('../src/api/tripsApi.js', () => ({
    fetchTrips: jest.fn()
}));
jest.mock('../src/api/apiClient.js', () => ({
    apiClient: jest.fn()
}));
jest.mock('../src/api/reservationApi.js', () => ({
    addItemToCart: jest.fn()
}));

describe('HomeView', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Testuje zobrazení načítacího spinneru, když jsou data o letech na cestě ze serveru.
    test('should render loading state', async () => {
        stateStore.getState.mockReturnValue({
            trips: { data: [], isLoading: true, error: null },
            user: { role: 'ROLE_USER' }
        });

        await renderHomeView(container);

        expect(container.innerHTML).toContain('spinner-border');
    });

    // Testuje správné vykreslení karet s jednotlivými lety na hlavní stránce.
    test('should render trips', async () => {
        stateStore.getState.mockReturnValue({
            trips: {
                data: [{ id: 1, name: 'Test Trip', price: 100, category: { name: 'Cat' }, location: { city: 'City' } }],
                isLoading: false,
                error: null
            },
            user: { role: 'ROLE_USER', isAuthenticated: true }
        });

        await renderHomeView(container);

        expect(container.innerHTML).toContain('Test Trip');
        expect(container.innerHTML).toContain('100 Kč');
    });

    // Testuje přechod na detail letu po kliknutí na jeho kartu v nabídce.
    test('should navigate to trip detail when card is clicked', async () => {
        stateStore.getState.mockReturnValue({
            trips: {
                data: [{ id: 1, name: 'Test Trip', price: 100, category: { name: 'Cat' }, location: { city: 'City' } }],
                isLoading: false,
                error: null
            },
            user: { role: 'ROLE_USER', isAuthenticated: true }
        });

        await renderHomeView(container);

        const card = container.querySelector('.clickable-card');
        card.click();

        expect(stateStore.dispatch).toHaveBeenCalledWith('NAVIGATE', { route: 'trip-detail', id: 1 });
    });

    // Testuje přidání vybraného letu do košíku po kliknutí na příslušné tlačítko.
    test('should add to cart when button is clicked', async () => {
        const reservationApi = require('../src/api/reservationApi.js');

        stateStore.getState.mockReturnValue({
            trips: {
                data: [{ id: 1, name: 'Test Trip', price: 100, category: { name: 'Cat' }, location: { city: 'City' } }],
                isLoading: false,
                error: null
            },
            user: { role: 'ROLE_USER', isAuthenticated: true }
        });

        await renderHomeView(container);

        const addBtn = container.querySelector('.add-to-cart-btn');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        await addBtn.dispatchEvent(event);

        expect(reservationApi.addItemToCart).toHaveBeenCalledWith(1, 1);
    });
});
