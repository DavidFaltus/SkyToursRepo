import { subscribe, getState } from './store/state.js';
import { renderNavbar } from './components/Navbar.js';
import { renderHomeView } from './views/HomeView.js';
import { renderLoginView } from './views/LoginView.js';
import { renderCartView } from './views/CartView.js';
import { renderProfileView } from './views/ProfileView.js';
import { renderOrdersView } from './views/OrdersView.js';
import { renderTripDetailView } from './views/TripDetailView.js';

// KONTEJNER PRO VYKRESLOVÁNÍ OBSAHU
const appContainer = document.getElementById('app');

const renderApp = () => {
    const state = getState();
    
    renderNavbar();

    // ROUTING JEDNOTLIVÝCH KOMPONENT
    switch (state.ui.currentRoute) {
        case 'home':
            renderHomeView(appContainer);
            break;
        case 'login':
            renderLoginView(appContainer);
            break;
        case 'cart':
            renderCartView(appContainer);
            break;
        case 'profile':
            renderProfileView(appContainer);
            break;
        case 'orders':
            renderOrdersView(appContainer);
            break;
        case 'trip-detail':
            renderTripDetailView(appContainer);
            break;
        default:
            appContainer.innerHTML = '<h2>404 - Stránka nenalezena</h2>';
    }
};

subscribe(renderApp);
renderApp();