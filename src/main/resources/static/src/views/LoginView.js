import { loginUser, registerUser } from '../api/authApi.js';

// ZOBRAZENÍ PŘÍHLASOVACÍHO A REGISTRAČNÍHO FORMULÁŘE
export const renderLoginView = (container) => {
    container.innerHTML = `
        <div class="row justify-content-center login-container mt-4">
            <div class="col-md-6 col-lg-5">
                <div class="card shadow-sm mb-4">
                    <div class="card-body p-4">
                        <h3 class="card-title mb-4">Přihlášení</h3>
                        <form id="login-form">
                            <div class="mb-3">
                                <label for="username" class="form-label">Uživatelské jméno</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Heslo</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Přihlásit se</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h3 class="card-title mb-4">Registrace nového uživatele</h3>
                        <form id="register-form">
                            <div class="mb-3">
                                <label for="reg-username" class="form-label">Uživatelské jméno</label>
                                <input type="text" class="form-control" id="reg-username" required>
                            </div>
                            <div class="mb-3">
                                <label for="reg-email" class="form-label">E-mail</label>
                                <input type="email" class="form-control" id="reg-email" required>
                            </div>
                            <div class="mb-3">
                                <label for="reg-password" class="form-label">Heslo</label>
                                <input type="password" class="form-control" id="reg-password" required>
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="reg-is-admin">
                                <label class="form-check-label" for="reg-is-admin">Registrovat jako administrátor</label>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-success">Zaregistrovat se</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // LISTENER NA PŘIHLÁŠENÍ
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userVal = document.getElementById('username').value;
        const passVal = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button');

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Přihlašování...';

        try {
            await loginUser(userVal, passVal);
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Přihlásit se';
        }
    });

    // LISTENER NA REGISTRACI
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userVal = document.getElementById('reg-username').value;
        const emailVal = document.getElementById('reg-email').value;
        const passVal = document.getElementById('reg-password').value;
        const isAdminVal = document.getElementById('reg-is-admin').checked; // Získání hodnoty checkboxu
        const submitBtn = e.target.querySelector('button');

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrace...';

        try {
            await registerUser(userVal, emailVal, passVal, isAdminVal); // Předání isAdminVal
            document.getElementById('register-form').reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Zaregistrovat se';
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Zaregistrovat se';
        }
    });
};