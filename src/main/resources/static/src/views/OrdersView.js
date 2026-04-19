import { getState, dispatch } from '../store/state.js';
import { fetchAllReservations, updateReservationStatus, deleteReservation } from '../api/userApi.js';
import { apiClient } from '../api/apiClient.js';

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
            <div class="col-12 d-flex justify-content-between align-items-center">
                <h2 class="mb-4">Správa všech objednávek</h2>
                <button id="show-summary-btn" class="btn btn-outline-info">Zobrazit rychlý přehled (z DB Pohledu)</button>
            </div>
        </div>
        <div id="summary-container" class="row mb-4 d-none">
            <div class="col-12">
                <div class="card bg-light">
                    <div class="card-body" id="summary-content">
                        Načítám přehled...
                    </div>
                </div>
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
    const summaryBtn = document.getElementById('show-summary-btn');
    const summaryContainer = document.getElementById('summary-container');
    const summaryContent = document.getElementById('summary-content');

    //VOLÁNÍ DB POHLEDU
    summaryBtn.addEventListener('click', async () => {
        if (summaryContainer.classList.contains('d-none')) {
            summaryContainer.classList.remove('d-none');
            try {
                const summaryData = await apiClient('/users/reservations/summary');
                if (summaryData.length === 0) {
                    summaryContent.innerHTML = 'Žádná data pro přehled.';
                    return;
                }
                
                let tableHtml = `
                    <table class="table table-sm table-bordered mt-2">
                        <thead>
                            <tr>
                                <th>ID Rezervace</th>
                                <th>Uživatel</th>
                                <th>Datum</th>
                                <th>Stav</th>
                                <th>Cena celkem</th>
                                <th>Počet typů položek</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                summaryData.forEach(row => {
                    const date = new Date(row.reservationDate).toLocaleString();
                    tableHtml += `
                        <tr>
                            <td>${row.reservationId}</td>
                            <td>${row.username}</td>
                            <td>${date}</td>
                            <td>${row.status}</td>
                            <td>${row.totalPrice} Kč</td>
                            <td>${row.itemsCount}</td>
                        </tr>
                    `;
                });
                tableHtml += '</tbody></table><small class="text-muted">Data načtena přímo z PostgreSQL pohledu v_reservation_summary</small>';
                summaryContent.innerHTML = tableHtml;
            } catch (err) {
                summaryContent.innerHTML = `<span class="text-danger">Chyba při načítání přehledu: ${err.message}</span>`;
            }
        } else {
            summaryContainer.classList.add('d-none');
        }
    });


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
