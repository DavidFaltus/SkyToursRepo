import { getState, dispatch } from '../store/state.js';
import { fetchTripById } from '../api/tripsApi.js';
import { addItemToCart } from '../api/reservationApi.js';
import { apiClient } from '../api/apiClient.js';

//TODO PRIDAT KE KAZDEMU PRODUKTU JINOU FOTKU
export const renderTripDetailView = async (container) => {
    const state = getState();
    const tripId = state.ui.selectedTripId;

    if (!tripId) {
        container.innerHTML = `<div class="alert alert-danger">Chyba: Nebyl vybrán žádný let.</div>`;
        return;
    }

    container.innerHTML = `<div class="loading-spinner-container"><div class="spinner-border text-primary" role="status"></div></div>`;

    try {
        const trip = await fetchTripById(tripId);

        //TODO IMPLEMENTACE HODNOCENÍ PRODUKTU PO DODÁNÍ
        //VOLÁNÍ VIEW NA PRŮMĚRNÉ HODNOCENÍ PRODUKTU
        let ratingHtml = '<span class="text-muted small">Hodnocení není k dispozici.</span>';
        try {
            const ratings = await apiClient('/trips/ratings/view');
            const myRating = ratings.find(r => r.tripId === trip.id);
            if (myRating && myRating.averageRating) {
                ratingHtml = `<span class="badge bg-warning text-dark"><i class="bi bi-star-fill"></i> ${myRating.averageRating} / 5</span> <small class="text-muted">(${myRating.reviewCount} hodnocení)</small>`;
            } else {
                ratingHtml = '<span class="badge bg-secondary">Zatím nehodnoceno</span>';
            }
        } catch (err) {
            console.error("Nepodařilo se načíst hodnocení", err);
        }

        let specsHtml = '';
        if (trip.specs) {
            Object.entries(trip.specs).forEach(([key, value]) => {
                specsHtml += `<li class="list-group-item"><strong>${key}:</strong> ${value}</li>`;
            });
        }

        // FOTKA PŘÍMO PŘIDANÁ DO PROJEKTU (FALLBACK)
        let imageUrl = '/assets/image.jpg';
        if (trip.imagePath && trip.imagePath.trim() !== '' && trip.imagePath !== 'null') {
            imageUrl = `/api/images/${trip.imagePath}`;
        }

        // ZOBRAZENÍ KONKRÉTNÍHO PRODUKTU
        container.innerHTML = `
            <div class="row mt-4">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#" id="breadcrumb-home">Nabídka letů</a></li>
                            <li class="breadcrumb-item active" aria-current="page">${trip.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div class="row g-5">
                <div class="col-md-7">
                    <img src="${imageUrl}" class="img-fluid rounded shadow-lg" alt="${trip.name}" onerror="this.onerror=null;this.src='/assets/image.jpg';">
                </div>
                <div class="col-md-5">
                    <h1 class="mb-3">${trip.name}</h1>
                    <div class="mb-2">${ratingHtml}</div>
                    <h5 class="text-muted mb-3">
                        ${trip.category ? trip.category.name : 'Neznámá kategorie'} | 
                        <i class="bi bi-geo-alt"></i> ${trip.location ? trip.location.city : 'Neznámá lokace'}
                    </h5>
                    <p class="lead">${trip.description || 'Bez popisu'}</p>
                    
                    <div class="card my-4">
                        <div class="card-header">Specifikace letu</div>
                        <ul class="list-group list-group-flush">
                            ${specsHtml}
                        </ul>
                    </div>

                    <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded">
                        <span class="h3 mb-0">${trip.price} Kč</span>
                        <button class="btn btn-success btn-lg add-to-cart-btn-detail" data-id="${trip.id}">
                            <i class="bi bi-cart-plus"></i> Přidat do košíku
                        </button>
                    </div>
                </div>
            </div>
        `;

        // LISTENERY
        document.getElementById('breadcrumb-home').addEventListener('click', (e) => {
            e.preventDefault();
            dispatch('NAVIGATE', { route: 'home' });
        });

        const addToCartBtn = container.querySelector('.add-to-cart-btn-detail');
        addToCartBtn.addEventListener('click', async () => {
            const state = getState();
            if (!state.user.isAuthenticated) {
                alert('Pro přidání do košíku se musíte přihlásit.');
                dispatch('NAVIGATE', { route: 'login' });
                return;
            }

            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Přidávám...';

            await addItemToCart(tripId, 1);

            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = '<i class="bi bi-check-lg"></i> Přidáno!';
            setTimeout(() => {
                addToCartBtn.innerHTML = '<i class="bi bi-cart-plus"></i> Přidat do košíku';
            }, 1500);
        });

    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">Chyba při načítání detailu letu: ${error.message}</div>`;
    }
};
