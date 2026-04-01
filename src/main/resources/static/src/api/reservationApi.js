import { apiClient } from './apiClient.js';
import { dispatch, getState } from '../store/state.js';

export const addItemToCart = async (tripId, quantity) => {
    try {
        const updatedCart = await apiClient('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ tripId, quantity })
        });
        dispatch('SET_CART', updatedCart);
    } catch (error) {
        console.error("[Reservation API] Chyba při přidávání do košíku:", error.message);
        alert('Chyba při přidávání do košíku: ' + error.message);
    }
};

export const checkoutCart = async () => {
    const state = getState();
    
    console.log("[Reservation API] Checkout - Stav uživatele:", {
        isAuthenticated: state.user.isAuthenticated,
        username: state.user.username,
        hasToken: !!state.user.token,
        cartItems: state.cart.items.length
    });
    
    if (!state.user.isAuthenticated) {
        alert("Pro dokončení rezervace se musíte přihlásit.");
        dispatch('NAVIGATE', { route: 'login' });
        return;
    }

    if (state.cart.items.length === 0) {
        alert("Košík je prázdný.");
        return;
    }

    try {
        console.log("[Reservation API] Odesílám checkout request...");
        const responseText = await apiClient('/cart/checkout', {
            method: 'POST'
        });

        console.log("[Reservation API] Úspěch:", responseText);
        alert("Úspěch: " + responseText);
        
        dispatch('CLEAR_CART');
        dispatch('NAVIGATE', { route: 'home' });

    } catch (error) {
        console.error("[Reservation API] Chyba:", error.message);
        alert('Chyba při vytváření rezervace: ' + error.message);
    }
};