import { fetchUserProfile, fetchUserReservations } from '../api/userApi.js';
import { addTripReview } from '../api/reservationApi.js';

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

    const loadReservations = async () => {
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
                    let ratingHtml = '';
                    
                    // Pokud je objednávka doručena, zobrazíme hodnocení nebo formulář
                    if (res.status === 'DELIVERED') {
                        if (item.rating) {
                            // Uživatelské hodnocení už existuje
                            ratingHtml = `
                                <div class="mt-2 text-success small">
                                    <strong>Vaše hodnocení:</strong> ${item.rating}/5 hvězdiček<br>
                                    <em>${item.review || ''}</em>
                                </div>
                            `;
                        } else {
                            // Formulář pro nové hodnocení
                            ratingHtml = `
                                <div class="mt-3 p-3 border rounded bg-light" id="rating-form-${res.id}-${item.tripId}">
                                    <h6>Ohodnotit produkt</h6>
                                    <div class="mb-2">
                                        <label class="form-label small">Počet hvězdiček:</label>
                                        <select class="form-select form-select-sm" id="rating-select-${res.id}-${item.tripId}">
                                            <option value="5">5 - Výborné</option>
                                            <option value="4">4 - Velmi dobré</option>
                                            <option value="3">3 - Dobré</option>
                                            <option value="2">2 - Dostatečné</option>
                                            <option value="1">1 - Nedostatečné</option>
                                        </select>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small">Slovní hodnocení (nepovinné):</label>
                                        <textarea class="form-control form-control-sm" id="rating-review-${res.id}-${item.tripId}" rows="2"></textarea>
                                    </div>
                                    <button class="btn btn-sm btn-primary rate-btn" data-res-id="${res.id}" data-trip-id="${item.tripId}">Odeslat hodnocení</button>
                                </div>
                            `;
                        }
                    }

                    itemsHtml += `
                        <li class="list-group-item flex-column align-items-start">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <span>${item.tripName} (x${item.quantity})</span>
                                <span class="badge bg-info rounded-pill">${item.unitPrice * item.quantity} Kč</span>
                            </div>
                            ${ratingHtml}
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

            // PŘIDÁNÍ EVENT LISTENERŮ PRO TLAČÍTKA HODNOCENÍ
            const rateButtons = userReservationsList.querySelectorAll('.rate-btn');
            rateButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const resId = e.target.getAttribute('data-res-id');
                    const tripId = e.target.getAttribute('data-trip-id');
                    
                    const ratingValue = document.getElementById(`rating-select-${resId}-${tripId}`).value;
                    const reviewValue = document.getElementById(`rating-review-${resId}-${tripId}`).value;
                    
                    try {
                        e.target.disabled = true;
                        e.target.textContent = 'Odesílám...';
                        
                        await addTripReview(tripId, {
                            rating: parseInt(ratingValue),
                            comment: reviewValue
                        });
                        
                        await loadReservations();
                    } catch (error) {
                        e.target.disabled = false;
                        e.target.textContent = 'Odeslat hodnocení';
                    }
                });
            });

        } catch (error) {
            userReservationsList.innerHTML = `<p class="text-danger">Chyba při načítání objednávek: ${error.message}</p>`;
        }
    };

    await loadReservations();
};
