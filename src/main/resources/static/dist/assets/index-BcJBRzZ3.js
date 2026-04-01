(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const m={user:{token:localStorage.getItem("jwt")||null,username:localStorage.getItem("username")||null,role:localStorage.getItem("role")||null,isAuthenticated:!!localStorage.getItem("jwt")},trips:{data:[],isLoading:!1,error:null},ui:{currentRoute:"home",selectedTripId:null},cart:{items:[]}},w=[],v=()=>({...m}),T=e=>{w.push(e)},L=()=>{for(const e of w)e()},c=(e,t)=>{switch(console.log(`[Store] Dispatching: ${e}`,t),e){case"NAVIGATE":m.ui.currentRoute=t.route,m.ui.selectedTripId=t.id||null;break;case"FETCH_TRIPS_START":m.trips.isLoading=!0,m.trips.error=null;break;case"FETCH_TRIPS_SUCCESS":m.trips.isLoading=!1,m.trips.data=t;break;case"FETCH_TRIPS_ERROR":m.trips.isLoading=!1,m.trips.error=t;break;case"LOGIN_SUCCESS":m.user.token=t.token,m.user.username=t.username,m.user.role=t.role,m.user.isAuthenticated=!0;break;case"LOGOUT":m.user={token:null,username:null,role:null,isAuthenticated:!1},localStorage.removeItem("jwt"),localStorage.removeItem("username"),localStorage.removeItem("role"),m.ui.currentRoute="home";break;case"SET_CART":m.cart.items=t.items||[];break;case"CLEAR_CART":m.cart.items=[];break;default:console.warn(`[Store] Neznámá akce: ${e}`);return}L()},A=()=>{var i,s,a,o,l,d;const e=document.getElementById("nav-menu"),t=v(),n=t.cart.items.reduce((u,h)=>u+h.quantity,0);let r=`
        <li class="nav-item">
            <a class="nav-link ${t.ui.currentRoute==="home"?"active":""}" href="#" id="nav-home-btn">Nabídka letů</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${t.ui.currentRoute==="cart"?"active":""}" href="#" id="nav-cart-btn">
                Košík <span class="badge bg-primary">${n}</span>
            </a>
        </li>
    `;t.user.isAuthenticated?(r+=`
            <li class="nav-item">
                <a class="nav-link ${t.ui.currentRoute==="profile"?"active":""}" href="#" id="nav-profile-btn">Můj profil</a>
            </li>
        `,t.user.role==="ROLE_ADMIN"&&(r+=`
                <li class="nav-item">
                    <a class="nav-link text-warning ${t.ui.currentRoute==="orders"?"active":""}" href="#" id="nav-admin-btn">Správa objednávek</a>
                </li>
            `),r+=`
            <li class="nav-item">
                <span class="nav-link text-success">Přihlášen: ${t.user.username}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link text-danger" href="#" id="nav-logout-btn">Odhlásit se</a>
            </li>
        `):r+=`
            <li class="nav-item">
                <a class="nav-link ${t.ui.currentRoute==="login"?"active":""}" href="#" id="nav-login-btn">Přihlásit / Registrovat</a>
            </li>
        `,e.innerHTML=r,(i=document.getElementById("nav-home-btn"))==null||i.addEventListener("click",u=>{u.preventDefault(),c("NAVIGATE",{route:"home"})}),(s=document.getElementById("nav-cart-btn"))==null||s.addEventListener("click",u=>{u.preventDefault(),c("NAVIGATE",{route:"cart"})}),(a=document.getElementById("nav-login-btn"))==null||a.addEventListener("click",u=>{u.preventDefault(),c("NAVIGATE",{route:"login"})}),(o=document.getElementById("nav-logout-btn"))==null||o.addEventListener("click",u=>{u.preventDefault(),c("LOGOUT")}),(l=document.getElementById("nav-profile-btn"))==null||l.addEventListener("click",u=>{u.preventDefault(),c("NAVIGATE",{route:"profile"})}),(d=document.getElementById("nav-admin-btn"))==null||d.addEventListener("click",u=>{u.preventDefault(),c("NAVIGATE",{route:"orders"})}),document.getElementById("nav-home").onclick=u=>{u.preventDefault(),c("NAVIGATE",{route:"home"})}},S="http://localhost:8080/api",p=async(e,t={})=>{const r=v().user.token,i={"Content-Type":"application/json",...t.headers};r?(i.Authorization=`Bearer ${r}`,console.log(`[API Client] Odesílám token pro endpoint: ${e}`)):console.log(`[API Client] Žádný token pro endpoint: ${e}`);const s={...t,headers:i};try{const a=await fetch(`${S}${e}`,s);if(!a.ok){if(a.status===401){if(r&&!e.includes("/auth"))c("LOGOUT"),alert("Platnost vašeho přihlášení vypršela. Přihlaste se prosím znovu.");else if(!r&&e.includes("/cart"))throw new Error("Pro přístup k nákupnímu košíku se musíte přihlásit.");throw new Error("Autentizace selhala (401): Přihlaste se prosím.")}if(a.status===403)throw new Error("Přístup odepřen (403). Nemáte oprávnění k tomuto zdroji.");const l=await a.text();throw new Error(l||`API chyba: ${a.status}`)}const o=a.headers.get("content-type");return o&&o.includes("application/json")?await a.json():await a.text()}catch(a){throw console.error(`[API Client] Chyba při volání ${e}:`,a),a}},y=async()=>{c("FETCH_TRIPS_START");try{const e=await p("/trips");c("FETCH_TRIPS_SUCCESS",e)}catch(e){c("FETCH_TRIPS_ERROR",e.message)}},P=async e=>{try{return await p(`/trips/${e}`)}catch(t){throw console.error(`Chyba při načítání detailu letu #${e}:`,t),t}},C=async e=>{try{const t=await p("/trips",{method:"POST",body:JSON.stringify(e)});return await y(),t}catch(t){throw t}},N=async(e,t)=>{try{const n=await p(`/trips/${e}`,{method:"PUT",body:JSON.stringify(t)});return await y(),n}catch(n){throw n}},I=async(e,t)=>{try{const n=await p("/cart/add",{method:"POST",body:JSON.stringify({tripId:e,quantity:t})});c("SET_CART",n)}catch(n){console.error("[Reservation API] Chyba při přidávání do košíku:",n.message),alert("Chyba při přidávání do košíku: "+n.message)}},R=async()=>{const e=v();if(console.log("[Reservation API] Checkout - Stav uživatele:",{isAuthenticated:e.user.isAuthenticated,username:e.user.username,hasToken:!!e.user.token,cartItems:e.cart.items.length}),!e.user.isAuthenticated){alert("Pro dokončení rezervace se musíte přihlásit."),c("NAVIGATE",{route:"login"});return}if(e.cart.items.length===0){alert("Košík je prázdný.");return}try{console.log("[Reservation API] Odesílám checkout request...");const t=await p("/cart/checkout",{method:"POST"});console.log("[Reservation API] Úspěch:",t),alert("Úspěch: "+t),c("CLEAR_CART"),c("NAVIGATE",{route:"home"})}catch(t){console.error("[Reservation API] Chyba:",t.message),alert("Chyba při vytváření rezervace: "+t.message)}},H=async e=>{var i;let t=v();if(t.trips.data.length===0&&!t.trips.isLoading&&!t.trips.error&&(await y(),t=v()),t.trips.isLoading){e.innerHTML='<div class="loading-spinner-container"><div class="spinner-border text-primary" role="status"></div></div>';return}if(t.trips.error){e.innerHTML=`<div class="alert alert-danger error-alert">Chyba při načítání dat: ${t.trips.error}</div>`;return}const n=t.user.role==="ROLE_ADMIN";let r=`
        <div class="row mb-4 home-header">
            <div class="col">
                <h1 class="home-title">Vyberte si svůj zážitek</h1>
                <p class="home-subtitle">Prozkoumejte nabídku našich letů a zarezervujte si nezapomenutelný zážitek.</p>
            </div>
        </div>
        <div class="row g-4 trips-grid">
    `;n&&(r+=`
            <div class="col-md-4 col-lg-4" id="add-trip-container">
                <div class="card h-100 trip-card shadow-sm add-new-card" style="cursor: pointer;">
                    <div class="card-body d-flex flex-column justify-content-center align-items-center">
                        <i class="bi bi-plus-circle-dotted" style="font-size: 3rem; color: #6c757d;"></i>
                        <h5 class="mt-3">Přidat nový let</h5>
                    </div>
                </div>
            </div>
        `),t.trips.data.forEach(s=>{let a="";s.specs&&Object.entries(s.specs).forEach(([l,d])=>{a+=`<span class="badge bg-secondary specs-badge">${l}: ${d}</span>`});const o=s.imagePath?`http://localhost:8080/api/images/${s.imagePath}`:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&h=200&fit=crop&auto=format";r+=`
            <div class="col-md-4 col-lg-4" id="trip-container-${s.id}">
                <div class="card h-100 trip-card shadow-sm clickable-card" data-id="${s.id}" style="cursor: pointer;">
                    <img src="${o}" class="card-img-top" alt="${s.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${s.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">
                            ${s.category?s.category.name:"Neznámá kategorie"} | 
                            <i class="bi bi-geo-alt"></i> ${s.location?s.location.city:"Neznámá lokace"}
                        </h6>
                        <p class="card-text text-truncate">${s.description||"Bez popisu"}</p>
                        <div class="mb-3">${a}</div>
                        
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="card-price">${s.price} Kč</span>
                            <div>
                                ${n?`<button class="btn btn-sm btn-outline-warning edit-trip-btn me-2" data-id="${s.id}">Upravit</button>`:""}
                                <button class="btn btn-outline-primary btn-sm add-to-cart-btn" data-id="${s.id}">
                                    Přidat do košíku
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `}),r+="</div>",e.innerHTML=r,e.querySelectorAll(".clickable-card").forEach(s=>{s.addEventListener("click",a=>{if(a.target.closest("button"))return;const o=parseInt(s.getAttribute("data-id"));c("NAVIGATE",{route:"trip-detail",id:o})})}),e.querySelectorAll(".add-to-cart-btn").forEach(s=>{s.addEventListener("click",async a=>{if(a.stopPropagation(),!v().user.isAuthenticated){alert("Pro přidání do košíku se musíte přihlásit."),c("NAVIGATE",{route:"login"});return}const l=parseInt(s.getAttribute("data-id"));s.disabled=!0,s.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>',await I(l,1),s.disabled=!1,s.textContent="Přidáno!",s.classList.replace("btn-outline-primary","btn-success"),setTimeout(()=>{s.textContent="Přidat do košíku",s.classList.replace("btn-success","btn-outline-primary")},1e3)})}),n&&((i=e.querySelector(".add-new-card"))==null||i.addEventListener("click",()=>{E(null,{})}),e.querySelectorAll(".edit-trip-btn").forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation();const o=parseInt(s.getAttribute("data-id")),l=t.trips.data.find(d=>d.id===o);l&&E(o,l)})}))},E=(e,t)=>{const n=e===null,r=document.getElementById(n?"add-trip-container":`trip-container-${e}`);if(!r)return;let i="";t.specs&&Object.entries(t.specs).forEach(([o,l],d)=>{i+=`
                <div class="input-group input-group-sm mb-2 spec-item">
                    <input type="text" class="form-control" placeholder="Klíč" value="${o}">
                    <input type="text" class="form-control" placeholder="Hodnota" value="${l}">
                    <button class="btn btn-outline-danger remove-spec-btn" type="button">×</button>
                </div>
            `}),r.innerHTML=`
        <div class="card h-100 trip-card shadow-sm border-${n?"success":"warning"}">
            <div class="card-body d-flex flex-column">
                <h5 class="text-${n?"success":"warning"} mb-3">
                    <i class="bi bi-${n?"plus-circle":"pencil-square"}"></i> ${n?"Vytvořit nový let":"Úprava produktu"}
                </h5>
                <form id="edit-form-${e}">
                    <div class="mb-2">
                        <label class="form-label small text-muted mb-0">Název letu</label>
                        <input type="text" class="form-control form-control-sm" id="edit-name" value="${t.name||""}" required>
                    </div>
                    <div class="row">
                        <div class="col-6 mb-2">
                            <label class="form-label small text-muted mb-0">Cena (Kč)</label>
                            <input type="number" step="0.01" class="form-control form-control-sm" id="edit-price" value="${t.price||""}" required>
                        </div>
                        <div class="col-6 mb-2">
                            <label class="form-label small text-muted mb-0">Kategorie ID</label>
                            <input type="number" class="form-control form-control-sm" id="edit-category" value="${t.categoryId||""}" required>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="form-label small text-muted mb-0">Lokace ID</label>
                        <input type="number" class="form-control form-control-sm" id="edit-location" value="${t.locationId||""}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-muted mb-0">Popis</label>
                        <textarea class="form-control form-control-sm" id="edit-desc" rows="3">${t.description||""}</textarea>
                    </div>
                    
                    <h6 class="small text-muted">Specifikace</h6>
                    <div id="specs-container">${i}</div>
                    <button class="btn btn-sm btn-outline-secondary w-100 mb-3" type="button" id="add-spec-btn">Přidat specifikaci</button>

                    <div class="mt-auto d-flex justify-content-between">
                        <button type="button" class="btn btn-sm btn-secondary cancel-edit-btn">Zrušit</button>
                        <button type="submit" class="btn btn-sm btn-${n?"success":"primary"} save-edit-btn">${n?"Vytvořit":"Uložit změny"}</button>
                    </div>
                </form>
            </div>
        </div>
    `;const s=r.querySelector("#specs-container"),a=()=>{const o=document.createElement("div");o.className="input-group input-group-sm mb-2 spec-item",o.innerHTML=`
            <input type="text" class="form-control" placeholder="Klíč">
            <input type="text" class="form-control" placeholder="Hodnota">
            <button class="btn btn-outline-danger remove-spec-btn" type="button">×</button>
        `,o.querySelector(".remove-spec-btn").addEventListener("click",()=>o.remove()),s.appendChild(o)};r.querySelector("#add-spec-btn").addEventListener("click",a),s.querySelectorAll(".remove-spec-btn").forEach(o=>{o.addEventListener("click",()=>o.closest(".spec-item").remove())}),r.querySelector("form").addEventListener("submit",async o=>{o.preventDefault();const l=o.target.querySelector(".save-edit-btn");l.disabled=!0,l.innerHTML="Ukládám...";const d={};s.querySelectorAll(".spec-item").forEach(h=>{const f=h.children[0].value,k=h.children[1].value;f&&k&&(d[f]=k)});const u={name:document.getElementById("edit-name").value,price:parseFloat(document.getElementById("edit-price").value),description:document.getElementById("edit-desc").value,categoryId:parseInt(document.getElementById("edit-category").value),locationId:parseInt(document.getElementById("edit-location").value),specs:d};try{n?await C(u):await N(e,{...t,...u})}catch(h){alert("Chyba při ukládání: "+h.message),l.disabled=!1,l.innerHTML=n?"Vytvořit":"Uložit změny"}}),r.querySelector(".cancel-edit-btn").addEventListener("click",()=>{c("NAVIGATE",{route:"home"})})},x=async(e,t)=>{try{const n=await p("/auth/login",{method:"POST",body:JSON.stringify({username:e,password:t})});c("LOGIN_SUCCESS",{token:n.token,username:n.username,role:n.role}),c("NAVIGATE",{route:"home"})}catch(n){throw alert("Přihlášení se nezdařilo. Zkontrolujte jméno a heslo."),n}},j=async(e,t,n,r)=>{try{const i=await p("/auth/register",{method:"POST",body:JSON.stringify({username:e,email:t,password:n,isAdmin:r})});return c("LOGIN_SUCCESS",{token:i.token,username:i.username,role:i.role}),c("NAVIGATE",{route:"home"}),alert("Registrace a přihlášení byly úspěšné!"),i}catch(i){throw alert("Registrace selhala: "+i.message),i}},z=e=>{e.innerHTML=`
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
    `,document.getElementById("login-form").addEventListener("submit",async t=>{t.preventDefault();const n=document.getElementById("username").value,r=document.getElementById("password").value,i=t.target.querySelector("button");i.disabled=!0,i.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Přihlašování...';try{await x(n,r)}catch{i.disabled=!1,i.innerHTML="Přihlásit se"}}),document.getElementById("register-form").addEventListener("submit",async t=>{t.preventDefault();const n=document.getElementById("reg-username").value,r=document.getElementById("reg-email").value,i=document.getElementById("reg-password").value,s=document.getElementById("reg-is-admin").checked,a=t.target.querySelector("button");a.disabled=!0,a.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrace...';try{await j(n,r,i,s),document.getElementById("register-form").reset(),a.disabled=!1,a.innerHTML="Zaregistrovat se"}catch{a.disabled=!1,a.innerHTML="Zaregistrovat se"}})},M=e=>{const n=v().cart.items;if(n.length===0){e.innerHTML=`
            <div class="empty-cart-container">
                <h2 class="empty-cart-heading">Váš košík je prázdný</h2>
                <p class="empty-cart-text">Vyberte si nějaký let z naší nabídky.</p>
                <button class="btn btn-primary" id="back-to-shop-btn">Zpět k nákupu</button>
            </div>
        `,document.getElementById("back-to-shop-btn").addEventListener("click",()=>c("NAVIGATE",{route:"home"}));return}let r=0,s=`
        <h2 class="mb-4">Košík a rezervace</h2>
        <div class="cart-table-section">
            <table class="table table-bordered table-hover cart-table">
                <thead class="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Název letu</th>
                        <th scope="col">Jednotková cena</th>
                        <th scope="col">Množství</th>
                        <th scope="col">Celkem</th>
                    </tr>
                </thead>
                <tbody>
                    ${n.map((o,l)=>{const d=o.quantity*o.unitPrice;return r+=d,`
            <tr>
                <td>${l+1}</td>
                <td>${o.tripName}</td>
                <td>${o.unitPrice} Kč</td>
                <td>${o.quantity}</td>
                <td><strong>${d} Kč</strong></td>
            </tr>
        `}).join("")}
                </tbody>
                <tfoot>
                    <tr class="cart-footer-row">
                        <td colspan="4">Celková částka:</td>
                        <td class="cart-total-amount">${r} Kč</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="cart-actions">
            <button class="btn btn-outline-danger" id="clear-cart-btn">Vyprázdnit košík</button>
            <div>
                <button class="btn btn-success btn-lg" id="checkout-btn">
                    Dokončit rezervaci
                </button>
            </div>
        </div>
    `;e.innerHTML=s,document.getElementById("clear-cart-btn").addEventListener("click",()=>{confirm("Opravdu chcete vyprázdnit košík?")&&c("CLEAR_CART")});const a=document.getElementById("checkout-btn");a&&!a.disabled&&a.addEventListener("click",async()=>{const o=document.getElementById("checkout-btn");o.disabled=!0,o.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Odesílám...',await R()})},O=async()=>{try{return await p("/users/me")}catch(e){throw console.error("Chyba při načítání profilu uživatele:",e),e}},B=async()=>{try{return await p("/users/me/reservations")}catch(e){throw console.error("Chyba při načítání rezervací uživatele:",e),e}},V=async()=>{try{return await p("/users/reservations")}catch(e){throw console.error("Chyba při načítání všech rezervací:",e),e}},q=async(e,t)=>{try{return await p(`/users/reservations/${e}/status`,{method:"PUT",body:JSON.stringify({newStatus:t})})}catch(n){throw console.error("Chyba při aktualizaci stavu rezervace:",n),n}},D=async e=>{try{return await p(`/users/reservations/${e}`,{method:"DELETE"})}catch(t){throw console.error("Chyba při mazání rezervace:",t),t}},_=async e=>{e.innerHTML=`
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
    `;const t=document.getElementById("user-profile-info"),n=document.getElementById("user-reservations-list");try{const r=await O();t.innerHTML=`
            <p><strong>Uživatelské jméno:</strong> ${r.username}</p>
            <p><strong>E-mail:</strong> ${r.email}</p>
            <p><strong>Role:</strong> ${r.role}</p>
            <p><strong>Členem od:</strong> ${new Date(r.createdAt).toLocaleDateString()}</p>
        `}catch(r){t.innerHTML=`<p class="text-danger">Chyba při načítání profilu: ${r.message}</p>`}try{const r=await B();if(r.length===0){n.innerHTML="<p>Zatím nemáte žádné objednávky.</p>";return}let i='<ul class="list-group">';r.forEach(s=>{const a=new Date(s.reservationDate).toLocaleString();let o='<ul class="list-group list-group-flush">';s.items.forEach(l=>{o+=`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${l.tripName} (x${l.quantity})
                        <span class="badge bg-info rounded-pill">${l.unitPrice*l.quantity} Kč</span>
                    </li>
                `}),o+="</ul>",i+=`
                <li class="list-group-item mb-3 shadow-sm">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Objednávka #${s.id}</h5>
                        <small>${a}</small>
                    </div>
                    <p class="mb-1">Stav: <strong>${s.status}</strong></p>
                    <p class="mb-1">Celková cena: <strong>${s.totalPrice} Kč</strong></p>
                    ${o}
                </li>
            `}),i+="</ul>",n.innerHTML=i}catch(r){n.innerHTML=`<p class="text-danger">Chyba při načítání objednávek: ${r.message}</p>`}},g=async e=>{if(!(v().user.role==="ROLE_ADMIN")){e.innerHTML='<div class="alert alert-danger">Přístup odepřen. Tato sekce je pouze pro administrátory.</div>';return}e.innerHTML=`
        <div class="row mt-4">
            <div class="col-12">
                <h2 class="mb-4">Správa všech objednávek</h2>
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
    `;const r=document.getElementById("all-orders-list");try{const i=await V();if(i.length===0){r.innerHTML="<p>Žádné objednávky nebyly nalezeny.</p>";return}let s='<ul class="list-group">';i.forEach(a=>{const o=new Date(a.reservationDate).toLocaleString();let l='<ul class="list-group list-group-flush">';a.items.forEach(d=>{l+=`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${d.tripName} (x${d.quantity}) - ${d.unitPrice} Kč/ks
                        <span class="badge bg-info rounded-pill">${d.unitPrice*d.quantity} Kč</span>
                    </li>
                `}),l+="</ul>",s+=`
                <li class="list-group-item mb-3 shadow-sm">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Objednávka #${a.id}</h5>
                        <small>${o}</small>
                    </div>
                    <p class="mb-1 small">Uživatel: ${a.username} (${a.userEmail})</p>
                    <p class="mb-1">Stav: <strong>${a.status}</strong></p>
                    <p class="mb-1">Celková cena: <strong>${a.totalPrice} Kč</strong></p>
                    ${l}
                    <div class="mt-2 d-flex justify-content-between align-items-center">
                        <div>
                            <select class="form-select form-select-sm d-inline-block w-auto me-2" id="status-select-${a.id}">
                                <option value="PENDING" ${a.status==="PENDING"?"selected":""}>Čekající</option>
                                <option value="SENT" ${a.status==="SENT"?"selected":""}>Odeslaná</option>
                                <option value="IN_DELIVERY" ${a.status==="IN_DELIVERY"?"selected":""}>V expedici</option>
                                <option value="DELIVERED" ${a.status==="DELIVERED"?"selected":""}>Doručeno</option>
                            </select>
                            <button class="btn btn-sm btn-primary update-status-btn" data-id="${a.id}">Změnit stav</button>
                        </div>
                        <button class="btn btn-sm btn-outline-danger delete-reservation-btn" data-id="${a.id}">Smazat</button>
                    </div>
                </li>
            `}),s+="</ul>",r.innerHTML=s,document.querySelectorAll(".update-status-btn").forEach(a=>{a.addEventListener("click",async o=>{const l=parseInt(o.target.dataset.id),d=document.getElementById(`status-select-${l}`).value;try{await q(l,d),alert("Stav objednávky aktualizován!"),g(e)}catch(u){alert("Chyba při aktualizaci stavu: "+u.message)}})}),document.querySelectorAll(".delete-reservation-btn").forEach(a=>{a.addEventListener("click",async o=>{const l=parseInt(o.target.dataset.id);if(confirm(`Opravdu chcete smazat objednávku #${l}?`))try{await D(l),alert("Objednávka byla smazána."),g(e)}catch(d){alert("Chyba při mazání objednávky: "+d.message)}})})}catch(i){r.innerHTML=`<p class="text-danger">Chyba při načítání objednávek: ${i.message}</p>`}},G=async e=>{const n=v().ui.selectedTripId;if(!n){e.innerHTML='<div class="alert alert-danger">Chyba: Nebyl vybrán žádný let.</div>';return}e.innerHTML='<div class="loading-spinner-container"><div class="spinner-border text-primary" role="status"></div></div>';try{const r=await P(n);let i="";r.specs&&Object.entries(r.specs).forEach(([o,l])=>{i+=`<li class="list-group-item"><strong>${o}:</strong> ${l}</li>`});const s=r.imagePath?`http://localhost:8080/api/images/${r.imagePath}`:"https://images.unsplash.com/photo-1526778548025-13a634d13045?q=80&w=1200&h=400&fit=crop&auto=format";e.innerHTML=`
            <div class="row mt-4">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#" id="breadcrumb-home">Nabídka letů</a></li>
                            <li class="breadcrumb-item active" aria-current="page">${r.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div class="row g-5">
                <div class="col-md-7">
                    <img src="${s}" class="img-fluid rounded shadow-lg" alt="${r.name}">
                </div>
                <div class="col-md-5">
                    <h1 class="mb-3">${r.name}</h1>
                    <h5 class="text-muted mb-3">
                        ${r.category?r.category.name:"Neznámá kategorie"} | 
                        <i class="bi bi-geo-alt"></i> ${r.location?r.location.city:"Neznámá lokace"}
                    </h5>
                    <p class="lead">${r.description||"Bez popisu"}</p>
                    
                    <div class="card my-4">
                        <div class="card-header">Specifikace letu</div>
                        <ul class="list-group list-group-flush">
                            ${i}
                        </ul>
                    </div>

                    <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded">
                        <span class="h3 mb-0">${r.price} Kč</span>
                        <button class="btn btn-success btn-lg add-to-cart-btn-detail" data-id="${r.id}">
                            <i class="bi bi-cart-plus"></i> Přidat do košíku
                        </button>
                    </div>
                </div>
            </div>
        `,document.getElementById("breadcrumb-home").addEventListener("click",o=>{o.preventDefault(),c("NAVIGATE",{route:"home"})});const a=e.querySelector(".add-to-cart-btn-detail");a.addEventListener("click",async()=>{if(!v().user.isAuthenticated){alert("Pro přidání do košíku se musíte přihlásit."),c("NAVIGATE",{route:"login"});return}a.disabled=!0,a.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Přidávám...',await I(n,1),a.disabled=!1,a.innerHTML='<i class="bi bi-check-lg"></i> Přidáno!',setTimeout(()=>{a.innerHTML='<i class="bi bi-cart-plus"></i> Přidat do košíku'},1500)})}catch(r){e.innerHTML=`<div class="alert alert-danger">Chyba při načítání detailu letu: ${r.message}</div>`}},b=document.getElementById("app"),$=()=>{const e=v();switch(A(),e.ui.currentRoute){case"home":H(b);break;case"login":z(b);break;case"cart":M(b);break;case"profile":_(b);break;case"orders":g(b);break;case"trip-detail":G(b);break;default:b.innerHTML="<h2>404 - Stránka nenalezena</h2>"}};T($);$();
