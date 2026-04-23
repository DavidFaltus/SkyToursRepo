import { renderProfileView } from '../src/views/ProfileView.js';
import * as userApi from '../src/api/userApi.js';

jest.mock('../src/api/userApi.js', () => ({
    fetchUserProfile: jest.fn(),
    fetchUserReservations: jest.fn()
}));
jest.mock('../src/api/reservationApi.js', () => ({
    addTripReview: jest.fn()
}));

describe('ProfileView', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Testuje načtení a správné zobrazení detailních informací o profilu uživatele z API.
    test('should render profile information', async () => {
        userApi.fetchUserProfile.mockResolvedValue({
            username: 'testuser', email: 'test@test.com', role: 'ROLE_USER', createdAt: '2023-01-01'
        });
        userApi.fetchUserReservations.mockResolvedValue([]);

        await renderProfileView(container);

        expect(container.innerHTML).toContain('testuser');
        expect(container.innerHTML).toContain('test@test.com');
    });
});
