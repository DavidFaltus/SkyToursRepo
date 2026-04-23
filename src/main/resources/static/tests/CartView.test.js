import { renderCartView } from '../src/views/CartView.js';
import * as stateStore from '../src/store/state.js';
import * as reservationApi from '../src/api/reservationApi.js';

jest.mock('../src/store/state.js', () => ({
    getState: jest.fn(),
    dispatch: jest.fn()
}));
jest.mock('../src/api/reservationApi.js', () => ({
    checkoutCart: jest.fn()
}));

describe('CartView', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Testuje zobrazení informace o prázdném košíku, pokud v něm nejsou žádné položky.
    test('should render empty cart', () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [] }
        });

        renderCartView(container);

        expect(container.innerHTML).toContain('empty-cart-container');
    });

    // Testuje funkčnost tlačítka pro návrat do obchodu z prázdného košíku.
    test('should handle back to shop button on empty cart', () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [] }
        });

        renderCartView(container);

        const btn = container.querySelector('#back-to-shop-btn');
        btn.click();

        expect(stateStore.dispatch).toHaveBeenCalledWith('NAVIGATE', { route: 'home' });
    });

    // Testuje správné zobrazení položek a celkové ceny v naplněném košíku.
    test('should render cart with items', () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [{ id: 1, tripName: 'Trip 1', unitPrice: 100, quantity: 2 }] }
        });

        renderCartView(container);

        expect(container.innerHTML).toContain('Trip 1');
        expect(container.innerHTML).toContain('200 Kč');
    });

    // Testuje odeslání objednávky na backend po kliknutí na tlačítko Dokončit rezervaci.
    test('should handle checkout button', async () => {
        stateStore.getState.mockReturnValue({
            cart: { items: [{ id: 1, tripName: 'Trip 1', unitPrice: 100, quantity: 2 }] }
        });

        renderCartView(container);

        const checkoutBtn = container.querySelector('#checkout-btn');
        await checkoutBtn.click();

        expect(reservationApi.checkoutCart).toHaveBeenCalled();
        expect(checkoutBtn.disabled).toBe(true);
    });

    // Testuje funkci kompletního vyprázdnění košíku včetně potvrzovacího dialogu.
    test('should handle clear cart button', () => {
        window.confirm = jest.fn(() => true);

        stateStore.getState.mockReturnValue({
            cart: { items: [{ id: 1, tripName: 'Trip 1', unitPrice: 100, quantity: 2 }] }
        });

        renderCartView(container);

        const clearBtn = container.querySelector('#clear-cart-btn');
        clearBtn.click();

        expect(window.confirm).toHaveBeenCalledWith('Opravdu chcete vyprázdnit košík?');
        expect(stateStore.dispatch).toHaveBeenCalledWith('CLEAR_CART');
    });
});
