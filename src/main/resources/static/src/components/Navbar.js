import { getState, dispatch } from '../store/state.js';


export const renderNavbar = () => {
    const navMenu = document.getElementById('nav-menu');
    const state = getState();

    // CELKOVÝ POČET VĚCÍ V KOŠÍKU
    const cartCount = state.cart.items.reduce((total, item) => total + item.quantity, 0);

    let html = `
        <li class="nav-item">
            <a class="nav-link ${state.ui.currentRoute === 'home' ? 'active' : ''}" href="#" id="nav-home-btn">Nabídka letů</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${state.ui.currentRoute === 'cart' ? 'active' : ''}" href="#" id="nav-cart-btn">
                Košík <span class="badge bg-primary">${cartCount}</span>
            </a>
        </li>
    `;

    if (state.user.isAuthenticated) {
        html += `
            <li class="nav-item">
                <a class="nav-link ${state.ui.currentRoute === 'profile' ? 'active' : ''}" href="#" id="nav-profile-btn">Můj profil</a>
            </li>
        `;

        // ZOBRAZENÍ SPRÁVY OBJEDNÁVEK PRO ADMINY
        if (state.user.role === 'ROLE_ADMIN') {
            html += `
                <li class="nav-item">
                    <a class="nav-link text-warning ${state.ui.currentRoute === 'orders' ? 'active' : ''}" href="#" id="nav-admin-btn">Správa objednávek</a>
                </li>
            `;
        }

        html += `
            <li class="nav-item">
                <span class="nav-link text-success">Přihlášen: ${state.user.username}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link text-danger" href="#" id="nav-logout-btn">Odhlásit se</a>
            </li>
        `;
    } else {
        html += `
            <li class="nav-item">
                <a class="nav-link ${state.ui.currentRoute === 'login' ? 'active' : ''}" href="#" id="nav-login-btn">Přihlásit / Registrovat</a>
            </li>
        `;
    }

    navMenu.innerHTML = html;

    // LISTENERY JEDNOTILVÝCH TLAČÍTEK
    document.getElementById('nav-home-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('NAVIGATE', { route: 'home' });
    });

    document.getElementById('nav-cart-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('NAVIGATE', { route: 'cart' });
    });

    document.getElementById('nav-login-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('NAVIGATE', { route: 'login' });
    });

    document.getElementById('nav-logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('LOGOUT');
    });

    document.getElementById('nav-profile-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('NAVIGATE', { route: 'profile' });
    });

    document.getElementById('nav-admin-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        dispatch('NAVIGATE', { route: 'orders' });
    });

    document.getElementById('nav-home').onclick = (e) => {
        e.preventDefault();
        dispatch('NAVIGATE', { route: 'home' });
    };
};