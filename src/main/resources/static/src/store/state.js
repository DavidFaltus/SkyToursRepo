const state = {
    user: {
        token: localStorage.getItem('jwt') || null,
        username: localStorage.getItem('username') || null,
        role: localStorage.getItem('role') || null,
        isAuthenticated: !!localStorage.getItem('jwt')
    },
    trips: {
        data: [],
        isLoading: false,
        error: null
    },
    ui: {
        currentRoute: 'home',
        selectedTripId: null,
    },
    cart: {
        items: []
    }
};

// LISTENERY REAGUJÍCÍ NA PŘÍPADNOU ZMĚNU
const listeners = [];

export const getState = () => {
    return { ...state };
};

export const subscribe = (listener) => {
    listeners.push(listener);
};

const emitChange = () => {
    for (const listener of listeners) {
        listener();
    }
};

export const dispatch = (action, payload) => {
    console.log(`[Store] Dispatching: ${action}`, payload);

    switch (action) {
        case 'NAVIGATE':
            state.ui.currentRoute = payload.route;
            state.ui.selectedTripId = payload.id || null;
            break;

        case 'FETCH_TRIPS_START':
            state.trips.isLoading = true;
            state.trips.error = null;
            break;

        case 'FETCH_TRIPS_SUCCESS':
            state.trips.isLoading = false;
            state.trips.data = payload;
            break;

        case 'FETCH_TRIPS_ERROR':
            state.trips.isLoading = false;
            state.trips.error = payload;
            break;

        case 'LOGIN_SUCCESS':
            state.user.token = payload.token;
            state.user.username = payload.username;
            state.user.role = payload.role;
            state.user.isAuthenticated = true;
            
            // ULOŽENÍ PRO TRVALÝ LOGIN
            //localStorage.setItem('jwt', payload.token);
            //localStorage.setItem('username', payload.username);
            //localStorage.setItem('role', payload.role);
            break;

        case 'LOGOUT':
            state.user = { token: null, username: null, role: null, isAuthenticated: false };
            localStorage.removeItem('jwt');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            state.ui.currentRoute = 'home';
            break;

        case 'SET_CART':
            state.cart.items = payload.items || [];
            break;

        case 'CLEAR_CART':
            state.cart.items = [];
            break;

        default:
            console.warn(`[Store] Neznámá akce: ${action}`);
            return;
    }

    // PUSHNUTÍ ZMĚNY
    emitChange();
};