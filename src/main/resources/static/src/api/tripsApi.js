import { apiClient } from './apiClient.js';
import { dispatch } from '../store/state.js';

// NAČTENÍ DETAILŮ PRODUKTŮ
export const fetchTrips = async () => {
    dispatch('FETCH_TRIPS_START');
    try {
        const tripsFromView = await apiClient('/trips/view');
        
        const mappedTrips = tripsFromView.map(tv => ({
            id: tv.tripId,
            name: tv.tripName,
            price: tv.price,
            description: 'Načteno přes databázový pohled (v_trip_details)',
            specs: tv.specs ? JSON.parse(tv.specs) : null,
            category: { name: tv.categoryName },
            location: { city: tv.departureCity },
            imagePath: null
        }));
        
        dispatch('FETCH_TRIPS_SUCCESS', mappedTrips);
    } catch (error) {
        dispatch('FETCH_TRIPS_ERROR', error.message);
    }
};

export const fetchTripById = async (id) => {
    try {
        const trip = await apiClient(`/trips/${id}`);
        return trip;
    } catch (error) {
        console.error(`Chyba při načítání detailu letu #${id}:`, error);
        throw error;
    }
};

// VYTVOŘENÍ NOVÉHO PRODUKTU
export const createTrip = async (newTripData) => {
    try {
        const result = await apiClient('/trips', {
            method: 'POST',
            body: JSON.stringify(newTripData)
        });
        
        await fetchTrips();
        return result;
    } catch (error) {
        throw error;
    }
};

// ÚPRAVA PRODUKTU
export const updateTrip = async (id, updatedData) => {
    try {
        const result = await apiClient(`/trips/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData)
        });
        
        await fetchTrips();
        return result;
    } catch (error) {
        throw error;
    }
};
