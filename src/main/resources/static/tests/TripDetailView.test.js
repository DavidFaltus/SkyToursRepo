import { renderTripDetailView } from '../src/views/TripDetailView.js';
import * as stateStore from '../src/store/state.js';
import * as tripsApi from '../src/api/tripsApi.js';
import * as apiClient from '../src/api/apiClient.js';

jest.mock('../src/store/state.js', () => ({
    getState: jest.fn(),
    dispatch: jest.fn()
}));
jest.mock('../src/api/tripsApi.js', () => ({
    fetchTripById: jest.fn()
}));
jest.mock('../src/api/reservationApi.js', () => ({
    addItemToCart: jest.fn()
}));
jest.mock('../src/api/apiClient.js', () => ({
    apiClient: jest.fn()
}));

describe('TripDetailView', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Testuje zobrazení chybového hlášení, pokud se uživatel pokusí otevřít detail bez vybraného zájezdu.
    test('should show error if no trip selected', async () => {
        stateStore.getState.mockReturnValue({
            ui: { selectedTripId: null }
        });

        await renderTripDetailView(container);

        expect(container.innerHTML).toContain('alert-danger');
    });

    // Testuje správné zobrazení načtených informací o konkrétním zájezdu, včetně jeho ceny a popisu.
    test('should render trip details', async () => {
        stateStore.getState.mockReturnValue({
            ui: { selectedTripId: 1 },
            user: { isAuthenticated: true }
        });
        tripsApi.fetchTripById.mockResolvedValue({
            id: 1, name: 'Detail Trip', price: 999, description: 'Desc'
        });
        apiClient.apiClient.mockResolvedValue([]);

        await renderTripDetailView(container);

        expect(container.innerHTML).toContain('Detail Trip');
        expect(container.innerHTML).toContain('999 Kč');
    });
});
