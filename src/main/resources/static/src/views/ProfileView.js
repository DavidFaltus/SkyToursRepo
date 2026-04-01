import { fetchUserProfile, fetchUserReservations } from '../api/userApi.js';

// KOSTRA ZOBRAZENÍ PROFILU VŠECH
export const renderProfileView = async (container) => {
    container.innerHTML = `
        <div class="row mt-4">
            <div class="col-12">
                <h2 class="mb-4">Můj profil</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        Informace o uživateli
                    </div>
                    <div class="card-body" id="user-profile-info">
                        <p>Načítám profil...</p>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card shadow-sm mb-4">
                    <div class="card-header">
                        Moje objednávky
                    </div>
                    <div class="card-body" id="user-reservations-list">
                        <p>Načítám objednávky...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const userProfileInfo = document.getElementById('user-profile-info');
    const userReservationsList = document.getElementById('user-reservations-list');

    // ZOBRAZENÍ KONKRÉTNÍHO PROFILU UŽIVATELE
    try {
        const profile = await fetchUserProfile();
        userProfileInfo.innerHTML = `
            <p><strong>Uživatelské jméno:</strong> ${profile.username}</p>
            <p><strong>E-mail:</strong> ${profile.email}</p>
            <p><strong>Role:</strong> ${profile.role}</p>
            <p><strong>Členem od:</strong> ${new Date(profile.createdAt).toLocaleDateString()}</p>
        `;
    } catch (error) {
        userProfileInfo.innerHTML = `<p class="text-danger">Chyba při načítání profilu: ${error.message}</p>`;
    }

    // ZOBRAZENÍ OBJEDNÁVEK UŽIVATELE
    try {
        const reservations = await fetchUserReservations();
        
        if (reservations.length === 0) {
            userReservationsList.innerHTML = `<p>Zatím nemáte žádné objednávky.</p>`;
            return;
        }

        let reservationsHtml = '<ul class="list-group">';
        reservations.forEach(res => {
            const reservationDate = new Date(res.reservationDate).toLocaleString();
            let itemsHtml = '<ul class="list-group list-group-flush">';
            res.items.forEach(item => {
                itemsHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item.tripName} (x${item.quantity})
                        <span class="badge bg-info rounded-pill">${item.unitPrice * item.quantity} Kč</span>
                    </li>
                `;
            });
            itemsHtml += '</ul>';

            reservationsHtml += `
                <li class="list-group-item mb-3 shadow-sm">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Objednávka #${res.id}</h5>
                        <small>${reservationDate}</small>
                    </div>
                    <p class="mb-1">Stav: <strong>${res.status}</strong></p>
                    <p class="mb-1">Celková cena: <strong>${res.totalPrice} Kč</strong></p>
                    ${itemsHtml}
                </li>
            `;
        });
        reservationsHtml += '</ul>';
        userReservationsList.innerHTML = reservationsHtml;

    } catch (error) {
        userReservationsList.innerHTML = `<p class="text-danger">Chyba při načítání objednávek: ${error.message}</p>`;
    }
};