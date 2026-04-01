import { apiClient } from './apiClient.js';

// LOAD DETAILŮ UŽIVATELE
export const fetchUserProfile = async () => {
    try {
        const userProfile = await apiClient('/users/me');
        return userProfile;
    } catch (error) {
        console.error('Chyba při načítání profilu uživatele:', error);
        throw error;
    }
};

export const fetchUserReservations = async () => {
    try {
        const reservations = await apiClient('/users/me/reservations');
        return reservations;
    } catch (error) {
        console.error('Chyba při načítání rezervací uživatele:', error);
        throw error;
    }
};


export const fetchAllReservations = async () => {
    try {
        const reservations = await apiClient('/users/reservations');
        return reservations;
    } catch (error) {
        console.error('Chyba při načítání všech rezervací:', error);
        throw error;
    }
};

// UPDATE STATUSU REZERVACE PRODUKTU
export const updateReservationStatus = async (reservationId, newStatus) => {
    try {
        const response = await apiClient(`/users/reservations/${reservationId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ newStatus })
        });
        return response;
    } catch (error) {
        console.error('Chyba při aktualizaci stavu rezervace:', error);
        throw error;
    }
};

// SMAZÁNÍ REZERVACE PRODUKTU
export const deleteReservation = async (reservationId) => {
    try {
        const response = await apiClient(`/users/reservations/${reservationId}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Chyba při mazání rezervace:', error);
        throw error;
    }
};