import { getState, dispatch } from '../store/state.js';
import { checkoutCart } from '../api/reservationApi.js';

export const renderCartView = (container) => {
    const state = getState();
    const items = state.cart.items;

    // POKUD JE KOŠÍK PRÁZDNÝ
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-container">
                <h2 class="empty-cart-heading">Váš košík je prázdný</h2>
                <p class="empty-cart-text">Vyberte si nějaký let z naší nabídky.</p>
                <button class="btn btn-primary" id="back-to-shop-btn">Zpět k nákupu</button>
            </div>
        `;
        document.getElementById('back-to-shop-btn').addEventListener('click', () => dispatch('NAVIGATE', { route: 'home' }));
        return;
    }

    // SKLÁDÁNÍ JEDNOTLIVÝCH PRODUKTŮ V KOŠÍKU
    let totalSum = 0;
    let tableRows = items.map((item, index) => {
        const itemTotal = item.quantity * item.unitPrice;
        totalSum += itemTotal;
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.tripName}</td>
                <td>${item.unitPrice} Kč</td>
                <td>${item.quantity}</td>
                <td><strong>${itemTotal} Kč</strong></td>
            </tr>
        `;
    }).join('');

    // ZOBRAZENÍ PRODUKTŮ V KOŠÍKU
    let html = `
        <h2 class="mb-4">Košík a rezervace</h2>
        <div class="cart-table-section">
            <table class="table table-bordered table-hover cart-table">
                <thead class="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Název letu</th>
                        <th scope="col">Jednotková cena</th>
                        <th scope="col">Množství</th>
                        <th scope="col">Celkem</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
                <tfoot>
                    <tr class="cart-footer-row">
                        <td colspan="4">Celková částka:</td>
                        <td class="cart-total-amount">${totalSum} Kč</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="cart-actions">
            <button class="btn btn-outline-danger" id="clear-cart-btn">Vyprázdnit košík</button>
            <div>
                <button class="btn btn-success btn-lg" id="checkout-btn">
                    Dokončit rezervaci
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // TODO MÍSTO VOLANI VYPRAZDNENI POVRCHNE VYMAZAT NA BACKENDUU
    document.getElementById('clear-cart-btn').addEventListener('click', () => {
        if(confirm('Opravdu chcete vyprázdnit košík?')) {
            dispatch('CLEAR_CART');
        }
    });

    // CHECKOUT PROCEDURA
    const checkoutBtn = document.getElementById('checkout-btn');
    if(checkoutBtn && !checkoutBtn.disabled) {
        checkoutBtn.addEventListener('click', async () => {
            const btn = document.getElementById('checkout-btn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Odesílám...';
            
            await checkoutCart();
        });
    }
};