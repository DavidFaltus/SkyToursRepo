import { getState, dispatch } from '../store/state.js';
import { fetchTrips, updateTrip, createTrip } from '../api/tripsApi.js';
import { addItemToCart } from '../api/reservationApi.js';
import { apiClient } from '../api/apiClient.js'; // Přidáno pro načítání lokací a kategorií

export const renderHomeView = async (container) => {
    let state = getState();

    if (state.trips.data.length === 0 && !state.trips.isLoading && !state.trips.error) {
        await fetchTrips();
        state = getState();
    }

    if (state.trips.isLoading) {
        container.innerHTML = `<div class="loading-spinner-container"><div class="spinner-border text-primary" role="status"></div></div>`;
        return;
    }

    if (state.trips.error) {
        container.innerHTML = `<div class="alert alert-danger error-alert">Chyba při načítání dat: ${state.trips.error}</div>`;
        return;
    }

    const isAdmin = state.user.role === 'ROLE_ADMIN';

    let html = `
        <div class="row mb-4 home-header">
            <div class="col">
                <h1 class="home-title">Vyberte si svůj zážitek</h1>
                <p class="home-subtitle">Prozkoumejte nabídku našich letů a zarezervujte si nezapomenutelný zážitek.</p>
            </div>
        </div>
        <div class="row g-4 trips-grid">
    `;

    // KARTA PRO ADMINA NA PŘIDÁNÍ DALŠÍHO PRODUKTU
    if (isAdmin) {
        html += `
            <div class="col-md-4 col-lg-4" id="add-trip-container">
                <div class="card h-100 trip-card shadow-sm add-new-card">
                    <div class="card-body d-flex flex-column justify-content-center align-items-center">
                        <i class="bi bi-plus-circle-dotted add-trip-icon"></i>
                        <h5 class="mt-3">Přidat nový let</h5>
                    </div>
                </div>
            </div>
        `;
    }

    // VYKRESLENÍ VŠECH DOSTUPNÝCH PRODUKTŮ
    state.trips.data.forEach(trip => {
        
        let specsHtml = '';
        if (trip.specs) {
            Object.entries(trip.specs).forEach(([key, value]) => {
                specsHtml += `<span class="badge bg-secondary specs-badge">${key}: ${value}</span>`;
            });
        }

        // FOTKA PŘÍMO PŘIDANÁ DO PROJEKTU (FALLBACK)
        // Musíme řešit "null", prázdný string i undefined
        let imageUrl = '/assets/image.jpg';
        if (trip.imagePath && trip.imagePath.trim() !== '' && trip.imagePath !== 'null') {
            imageUrl = `/api/images/${trip.imagePath}`;
        }

        html += `
            <div class="col-md-4 col-lg-4" id="trip-container-${trip.id}">
                <div class="card h-100 trip-card shadow-sm clickable-card" data-id="${trip.id}">
                    <img src="${imageUrl}" class="card-img-top" alt="${trip.name}" onerror="this.onerror=null;this.src='/assets/image.jpg';">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${trip.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">
                            ${trip.category ? trip.category.name : 'Neznámá kategorie'} | 
                            <i class="bi bi-geo-alt"></i> ${trip.location ? trip.location.city : 'Neznámá lokace'}
                        </h6>
                        <p class="card-text text-truncate">${trip.description || 'Bez popisu'}</p>
                        <div class="mb-3">${specsHtml}</div>
                        
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="card-price">${trip.price} Kč</span>
                            <div>
                                ${isAdmin ? `<button class="btn btn-sm btn-outline-warning edit-trip-btn me-2" data-id="${trip.id}">Upravit</button>` : ''}
                                <button class="btn btn-outline-primary btn-sm add-to-cart-btn" data-id="${trip.id}">
                                    Přidat do košíku
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // LISTENERY PRO BĚŽNÉ UŽIVATELE
    container.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            const tripId = parseInt(card.getAttribute('data-id'));
            dispatch('NAVIGATE', { route: 'trip-detail', id: tripId });
        });
    });

    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const state = getState();
            if (!state.user.isAuthenticated) {
                alert('Pro přidání do košíku se musíte přihlásit.');
                dispatch('NAVIGATE', { route: 'login' });
                return;
            }
            const tripId = parseInt(btn.getAttribute('data-id'));
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            await addItemToCart(tripId, 1);
            btn.disabled = false;
            btn.textContent = 'Přidáno!';
            btn.classList.replace('btn-outline-primary', 'btn-success');
            setTimeout(() => {
                btn.textContent = 'Přidat do košíku';
                btn.classList.replace('btn-success', 'btn-outline-primary');
            }, 1000);
        });
    });

    // LISTENERY PRO ADMINY
    if (isAdmin) {
        container.querySelector('.add-new-card')?.addEventListener('click', () => {
            renderEditForm(null, {}); // Voláme s null ID pro vytvoření
        });

        container.querySelectorAll('.edit-trip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tripId = parseInt(btn.getAttribute('data-id'));
                const trip = state.trips.data.find(t => t.id === tripId);
                if (trip) {
                    renderEditForm(tripId, trip);
                }
            });
        });
    }
};

const renderEditForm = async (tripId, trip) => {
    const isCreating = tripId === null;
    const container = document.getElementById(isCreating ? 'add-trip-container' : `trip-container-${tripId}`);
    if (!container) return;

    // Načtení kategorií a lokací pro dropdowny
    let categories = [];
    let locations = [];
    try {
        categories = await apiClient('/categories');
        locations = await apiClient('/locations');
    } catch (err) {
        console.error("Chyba při načítání číselníků pro formulář:", err);
    }

    let categoryOptions = categories.map(cat => 
        `<option value="${cat.id}" ${trip.category && trip.category.id === cat.id ? 'selected' : ''}>${cat.name}</option>`
    ).join('');

    let locationOptions = locations.map(loc => 
        `<option value="${loc.id}" ${trip.location && trip.location.id === loc.id ? 'selected' : ''}>${loc.city} - ${loc.name}</option>`
    ).join('');


    let specsHtml = '';
    if (trip.specs) {
        Object.entries(trip.specs).forEach(([key, value], index) => {
            specsHtml += `
                <div class="input-group input-group-sm mb-2 spec-item">
                    <input type="text" class="form-control" placeholder="Klíč" value="${key}">
                    <input type="text" class="form-control" placeholder="Hodnota" value="${value}">
                    <button class="btn btn-outline-danger remove-spec-btn" type="button">×</button>
                </div>
            `;
        });
    }

    // FORMULÁŘ NA VYTVOŘENÍ NOVÉHO PRODUKTU
    container.innerHTML = `
        <div class="card h-100 trip-card shadow-sm border-${isCreating ? 'success' : 'warning'}">
            <div class="card-body d-flex flex-column">
                <h5 class="text-${isCreating ? 'success' : 'warning'} mb-3">
                    <i class="bi bi-${isCreating ? 'plus-circle' : 'pencil-square'}"></i> ${isCreating ? 'Vytvořit nový let' : 'Úprava produktu'}
                </h5>
                <form id="edit-form-${tripId}">
                    <div class="mb-2">
                        <label class="form-label small text-muted mb-0">Název letu</label>
                        <input type="text" class="form-control form-control-sm" id="edit-name" value="${trip.name || ''}" required>
                    </div>
                    <div class="row">
                        <div class="col-6 mb-2">
                            <label class="form-label small text-muted mb-0">Cena (Kč)</label>
                            <input type="number" step="0.01" class="form-control form-control-sm" id="edit-price" value="${trip.price || ''}" required>
                        </div>
                        <div class="col-6 mb-2">
                            <label class="form-label small text-muted mb-0">Kategorie</label>
                            <select class="form-select form-select-sm" id="edit-category" required>
                                <option value="" disabled ${!trip.category ? 'selected' : ''}>Vyberte kategorii...</option>
                                ${categoryOptions}
                            </select>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="form-label small text-muted mb-0">Lokace</label>
                        <select class="form-select form-select-sm" id="edit-location" required>
                            <option value="" disabled ${!trip.location ? 'selected' : ''}>Vyberte lokaci...</option>
                            ${locationOptions}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-muted mb-0">Popis</label>
                        <textarea class="form-control form-control-sm" id="edit-desc" rows="3">${trip.description || ''}</textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label small text-muted mb-0">Obrázek (volitelné)</label>
                        <input class="form-control form-control-sm" type="file" id="edit-image" accept="image/*">
                        <small class="text-muted d-block mt-1">Nahraje se po uložení produktu.</small>
                    </div>

                    <h6 class="small text-muted">Specifikace</h6>
                    <div id="specs-container">${specsHtml}</div>
                    <button class="btn btn-sm btn-outline-secondary w-100 mb-3" type="button" id="add-spec-btn">Přidat specifikaci</button>

                    <div class="mt-auto d-flex justify-content-between">
                        <button type="button" class="btn btn-sm btn-secondary cancel-edit-btn">Zrušit</button>
                        <button type="submit" class="btn btn-sm btn-${isCreating ? 'success' : 'primary'} save-edit-btn">${isCreating ? 'Vytvořit' : 'Uložit změny'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const specsContainer = container.querySelector('#specs-container');

    const addSpecField = () => {
        const div = document.createElement('div');
        div.className = 'input-group input-group-sm mb-2 spec-item';
        div.innerHTML = `
            <input type="text" class="form-control" placeholder="Klíč">
            <input type="text" class="form-control" placeholder="Hodnota">
            <button class="btn btn-outline-danger remove-spec-btn" type="button">×</button>
        `;
        div.querySelector('.remove-spec-btn').addEventListener('click', () => div.remove());
        specsContainer.appendChild(div);
    };

    container.querySelector('#add-spec-btn').addEventListener('click', addSpecField);
    specsContainer.querySelectorAll('.remove-spec-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.closest('.spec-item').remove());
    });

    // ULOŽENÍ NOVÉHO PRODUKTU
    container.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.save-edit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Ukládám...';

        const specs = {};
        specsContainer.querySelectorAll('.spec-item').forEach(item => {
            const key = item.children[0].value;
            const value = item.children[1].value;
            if (key && value) {
                specs[key] = value;
            }
        });

        const data = {
            name: document.getElementById('edit-name').value,
            price: parseFloat(document.getElementById('edit-price').value),
            description: document.getElementById('edit-desc').value,
            categoryId: parseInt(document.getElementById('edit-category').value),
            locationId: parseInt(document.getElementById('edit-location').value),
            specs: specs
        };

        const imageFile = document.getElementById('edit-image').files[0];

        try {
            let savedTrip;
            if (isCreating) {
                savedTrip = await createTrip(data);
            } else {
                savedTrip = await updateTrip(tripId, { ...trip, ...data });
            }

            // Pokud uživatel vybral i obrázek, nahrajeme ho
            if (imageFile && savedTrip && savedTrip.id) {
                const formData = new FormData();
                formData.append('file', imageFile);

                submitBtn.innerHTML = 'Nahrávám obrázek...';
                const token = getState().user.token;

                const response = await fetch(`http://localhost:8080/api/images/upload/${savedTrip.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Chyba při nahrávání obrázku.');
                }
                
                // Po nahrání fotky znovu načteme data pro zobrazení s novou fotkou
                await fetchTrips();
            }
            
            // Po úspěšném uložení dat a fotky obnovíme zobrazení
            dispatch('NAVIGATE', { route: 'home' });

        } catch (error) {
            alert('Chyba při ukládání: ' + error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = isCreating ? 'Vytvořit' : 'Uložit změny';
        }
    });

    container.querySelector('.cancel-edit-btn').addEventListener('click', () => {
        dispatch('NAVIGATE', { route: 'home' });
    });
};
