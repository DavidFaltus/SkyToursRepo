import { renderOrdersView } from '../src/views/OrdersView.js';
import * as stateStore from '../src/store/state.js';
import * as userApi from '../src/api/userApi.js';
import * as apiClient from '../src/api/apiClient.js';

jest.mock('../src/store/state.js', () => ({
    getState: jest.fn(),
    dispatch: jest.fn()
}));
jest.mock('../src/api/userApi.js', () => ({
    fetchAllReservations: jest.fn()
}));
jest.mock('../src/api/apiClient.js', () => ({
    apiClient: jest.fn()
}));

describe('OrdersView', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Testuje bezpečnostní omezení přístupu na stránku správy objednávek pro uživatele bez role admina.
    test('should restrict access to non-admin users', async () => {
        stateStore.getState.mockReturnValue({
            user: { role: 'ROLE_USER' }
        });

        await renderOrdersView(container);

        expect(container.innerHTML).toContain('alert-danger');
    });

    // Testuje načtení a správné zobrazení existujících objednávek pro admina.
    test('should fetch and render orders for admin', async () => {
        stateStore.getState.mockReturnValue({
            user: { role: 'ROLE_ADMIN' }
        });
        userApi.fetchAllReservations.mockResolvedValue([
            { id: 1, reservationDate: '2023-01-01', username: 'testuser', status: 'PENDING', totalPrice: 500, items: [] }
        ]);

        await renderOrdersView(container);

        expect(container.innerHTML).toContain('Objednávka #1');
        expect(container.innerHTML).toContain('testuser');
    });
});
