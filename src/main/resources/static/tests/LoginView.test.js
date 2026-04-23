import { renderLoginView } from '../src/views/LoginView.js';
import * as authApi from '../src/api/authApi.js';

jest.mock('../src/api/authApi.js', () => ({
    loginUser: jest.fn(),
    registerUser: jest.fn()
}));

describe('LoginView', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Testuje, zda se správně vykreslí jak přihlašovací, tak registrační formulář se všemi inputy.
    test('should render login and register forms', () => {
        renderLoginView(container);

        expect(container.querySelector('#login-form')).not.toBeNull();
        expect(container.querySelector('#register-form')).not.toBeNull();
        expect(container.querySelector('#username')).not.toBeNull();
        expect(container.querySelector('#password')).not.toBeNull();
        expect(container.querySelector('#reg-username')).not.toBeNull();
        expect(container.querySelector('#reg-email')).not.toBeNull();
        expect(container.querySelector('#reg-password')).not.toBeNull();
        expect(container.querySelector('#reg-is-admin')).not.toBeNull();
    });

    // Testuje proces odeslání přihlašovacího formuláře a volání odpovídající metody authApi.
    test('should handle login submission', async () => {
        renderLoginView(container);

        authApi.loginUser.mockResolvedValue({});

        const usernameInput = container.querySelector('#username');
        const passwordInput = container.querySelector('#password');
        const loginForm = container.querySelector('#login-form');

        usernameInput.value = 'testuser';
        passwordInput.value = 'password123';

        const submitEvent = new Event('submit', { cancelable: true });
        loginForm.dispatchEvent(submitEvent);

        expect(authApi.loginUser).toHaveBeenCalledWith('testuser', 'password123');
    });

    // Testuje proces odeslání registračního formuláře a správné předání zadaných uživatelských dat do authApi.
    test('should handle register submission', async () => {
        renderLoginView(container);

        authApi.registerUser.mockResolvedValue({});

        const regUsernameInput = container.querySelector('#reg-username');
        const regEmailInput = container.querySelector('#reg-email');
        const regPasswordInput = container.querySelector('#reg-password');
        const regIsAdminInput = container.querySelector('#reg-is-admin');
        const registerForm = container.querySelector('#register-form');

        regUsernameInput.value = 'newuser';
        regEmailInput.value = 'new@user.com';
        regPasswordInput.value = 'newpass';
        regIsAdminInput.checked = true;

        const submitEvent = new Event('submit', { cancelable: true });
        registerForm.dispatchEvent(submitEvent);

        expect(authApi.registerUser).toHaveBeenCalledWith('newuser', 'new@user.com', 'newpass', true);
    });
});
