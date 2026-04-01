import { getState, dispatch } from '../store/state.js';
import { fetchAllReservations, updateReservationStatus, deleteReservation } from '../api/userApi.js';

export const renderOrdersView = async (container) => {
    const state = getState();
    const isAdmin = state.user.role === 'ROLE_ADMIN';

    // ZOBRAZENÍ SEKCE POUZE PRO ADMINY
    if (!isAdmin) {
        container.innerHTML = `<div class="alert alert-danger">Přístup odepřen. Tato sekce je pouze pro administrátory.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h2 class="mb-4">Správa všech objednávek</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-body" id="all-orders-list">
                        <p>Načítám objednávky...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const allOrdersList = document.getElementById('all-orders-list');

    try {
        const reservations = await fetchAllReservations();
        
        if (reservations.length === 0) {
            allOrdersList.innerHTML = `<p>Žádné objednávky nebyly nalezeny.</p>`;
            return;
        }

        let reservationsHtml = '<ul class="list-group">';
        reservations.forEach(res => {
            const reservationDate = new Date(res.reservationDate).toLocaleString();
            let itemsHtml = '<ul class="list-group list-group-flush">';
            res.items.forEach(item => {
                itemsHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item.tripName} (x${item.quantity}) - ${item.unitPrice} Kč/ks
                        <span class="badge bg-info rounded-pill">${item.unitPrice * item.quantity} Kč</span>
                    </li>
                `;
            });
            itemsHtml += '</ul>';

            // ZOBRAZENÍ JEDNOTLIVÝCH OBJEDNÁVEK
            reservationsHtml += `
                <li class="list-group-item mb-3 shadow-sm">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Objednávka #${res.id}</h5>
                        <small>${reservationDate}</small>
                    </div>
                    <p class="mb-1 small">Uživatel: ${res.username} (${res.userEmail})</p>
                    <p class="mb-1">Stav: <strong>${res.status}</strong></p>
                    <p class="mb-1">Celková cena: <strong>${res.totalPrice} Kč</strong></p>
                    ${itemsHtml}
                    <div class="mt-2 d-flex justify-content-between align-items-center">
                        <div>
                            <select class="form-select form-select-sm d-inline-block w-auto me-2" id="status-select-${res.id}">
                                <option value="PENDING" ${res.status === 'PENDING' ? 'selected' : ''}>Čekající</option>
                                <option value="SENT" ${res.status === 'SENT' ? 'selected' : ''}>Odeslaná</option>
                                <option value="IN_DELIVERY" ${res.status === 'IN_DELIVERY' ? 'selected' : ''}>V expedici</option>
                                <option value="DELIVERED" ${res.status === 'DELIVERED' ? 'selected' : ''}>Doručeno</option>
                            </select>
                            <button class="btn btn-sm btn-primary update-status-btn" data-id="${res.id}">Změnit stav</button>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-reservation-btn" data-id="${res.id}">Smazat</button>
                    </div>
                </li>
            `;
        });
        reservationsHtml += '</ul>';
        allOrdersList.innerHTML = reservationsHtml;

        // LISTENER NA AKTUALIZACI PRODUKTU
        document.querySelectorAll('.update-status-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const reservationId = parseInt(e.target.dataset.id);
                const newStatus = document.getElementById(`status-select-${reservationId}`).value;
                try {
                    await updateReservationStatus(reservationId, newStatus);
                    alert('Stav objednávky aktualizován!');
                    renderOrdersView(container); // Znovu načíst pohled pro aktualizaci
                } catch (error) {
                    alert('Chyba při aktualizaci stavu: ' + error.message);
                }
            });
        });

        // LISTENER NA SMAZÁNÍ PRODUKTU
        document.querySelectorAll('.delete-reservation-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const reservationId = parseInt(e.target.dataset.id);
                if (confirm(`Opravdu chcete smazat objednávku #${reservationId}?`)) {
                    try {
                        await deleteReservation(reservationId);
                        alert('Objednávka byla smazána.');
                        renderOrdersView(container); // Znovu načíst pohled pro aktualizaci
                    } catch (error) {
                        alert('Chyba při mazání objednávky: ' + error.message);
                    }
                }
            });
        });

    } catch (error) {
        allOrdersList.innerHTML = `<p class="text-danger">Chyba při načítání objednávek: ${error.message}</p>`;
    }
};