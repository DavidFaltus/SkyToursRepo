-- init.sql: Vytvoření základní struktury databáze SkyTours

-- 1. TABULKY (Celkem 10)

-- Tabulka rolí (1)
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabulka uživatelů (2)
CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT
);

-- Profil pasažéra pro specifika (např. váha u malých letadel) (3)
CREATE TABLE passenger_profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    medical_notes TEXT,
    CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

-- Lokace odletu (4)
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    gps_coordinates VARCHAR(100)
);

-- Tabulka kategorií letů (5)
CREATE TABLE trip_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Tabulka letů (trip) s JSONB sloupcem pro specifické parametry (6)
CREATE TABLE trip (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    specs JSONB, -- např. {"duration_min": 60, "instructor_included": true, "max_passengers": 3}
    image_path VARCHAR(255),
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES trip_category(id) ON DELETE RESTRICT,
    CONSTRAINT fk_location FOREIGN KEY (location_id) REFERENCES location(id) ON DELETE RESTRICT
);

-- Audit tabulka pro změny cen (7)
CREATE TABLE trip_price_audit (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    old_price DECIMAL(10, 2) NOT NULL,
    new_price DECIMAL(10, 2) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_audit FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE CASCADE
);

-- Hodnocení (Recenze) letů (8)
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    trip_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_trip FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE CASCADE
);

-- Tabulka rezervací (9)
CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_user_reservation FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    -- Přidáno CHECK omezení pro povolené stavy rezervace
    CONSTRAINT chk_reservation_status CHECK (status IN ('PENDING', 'CART', 'SENT', 'IN_DELIVERY', 'DELIVERED'))
);

-- Vazební tabulka položek rezervace s kompozitním primárním klíčem (10)
CREATE TABLE reservation_item (
    reservation_id INTEGER NOT NULL,
    trip_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (reservation_id, trip_id),
    CONSTRAINT fk_reservation_item_res FOREIGN KEY (reservation_id) REFERENCES reservation(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_item_trip FOREIGN KEY (trip_id) REFERENCES trip(id) ON DELETE RESTRICT
);

-- 2. POHLEDY (VIEWS) - 3x

-- View: Detailní pohled na let
CREATE VIEW v_trip_details AS
SELECT
    t.id AS trip_id,
    t.name AS trip_name,
    c.name AS category_name,
    l.city AS departure_city,
    t.price,
    t.specs
FROM trip t
JOIN trip_category c ON t.category_id = c.id
JOIN location l ON t.location_id = l.id;

-- View: Přehled rezervací uživatelů
CREATE VIEW v_reservation_summary AS
SELECT
    r.id AS reservation_id,
    u.username,
    r.reservation_date,
    r.status,
    r.total_price,
    COUNT(ri.trip_id) AS items_count
FROM reservation r
JOIN app_user u ON r.user_id = u.id
LEFT JOIN reservation_item ri ON r.id = ri.reservation_id
GROUP BY r.id, u.username;

-- View: Průměrné hodnocení letů
CREATE VIEW v_trip_ratings AS
SELECT
    t.id AS trip_id,
    t.name AS trip_name,
    ROUND(AVG(rv.rating), 2) AS average_rating,
    COUNT(rv.id) AS review_count
FROM trip t
LEFT JOIN review rv ON t.id = rv.trip_id
GROUP BY t.id, t.name;

-- 3. FUNKCE (FUNCTIONS) - 3x

-- Funkce: Výpočet celkové ceny položek pro rezervaci
CREATE OR REPLACE FUNCTION calculate_total_price(p_reservation_id INT)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    v_total DECIMAL(10, 2);
BEGIN
    SELECT COALESCE(SUM(quantity * unit_price), 0)
    INTO v_total
    FROM reservation_item
    WHERE reservation_id = p_reservation_id;

    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Funkce: Získání dostupných letů pod určitou cenu
CREATE OR REPLACE FUNCTION get_trips_under_price(p_max_price DECIMAL)
RETURNS TABLE(trip_id INT, trip_name VARCHAR, price DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.name, t.price
    FROM trip t
    WHERE t.price <= p_max_price;
END;
$$ LANGUAGE plpgsql;

-- Funkce: Formátovaný výpis profilu pasažéra
CREATE OR REPLACE FUNCTION get_passenger_info(p_user_id INT)
RETURNS TEXT AS $$
DECLARE
    v_info TEXT;
BEGIN
    SELECT 'Váha: ' || weight_kg || ' kg, Výška: ' || height_cm || ' cm'
    INTO v_info
    FROM passenger_profile
    WHERE user_id = p_user_id;

    RETURN COALESCE(v_info, 'Profil nevyplněn');
END;
$$ LANGUAGE plpgsql;

-- 4. PROCEDURY (STORED PROCEDURES) - 3x

-- Procedura: Vytvoření rezervace s položkou (S transakcí a rollbackem)
CREATE OR REPLACE PROCEDURE sp_create_reservation(
    p_user_id INT,
    p_trip_id INT,
    p_quantity INT,
    p_status VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_reservation_id INT;
    v_trip_price DECIMAL(10, 2);
BEGIN
    SELECT price INTO v_trip_price FROM trip WHERE id = p_trip_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Let s ID % neexistuje', p_trip_id;
    END IF;

    -- Vytvoření hlavičky
    INSERT INTO reservation (user_id, status)
    VALUES (p_user_id, p_status)
    RETURNING id INTO v_reservation_id;

    -- Vložení položky (může selhat např. na množství <= 0)
    INSERT INTO reservation_item (reservation_id, trip_id, quantity, unit_price)
    VALUES (v_reservation_id, p_trip_id, p_quantity, v_trip_price);

EXCEPTION
    WHEN OTHERS THEN
        -- V případě jakékoliv chyby následuje logování a ROLLBACK
        RAISE NOTICE 'Chyba při vytváření rezervace: %', SQLERRM;
        ROLLBACK;
        RAISE;
END;
$$;

-- Procedura: Změna stavu rezervace
CREATE OR REPLACE PROCEDURE sp_update_reservation_status(
    p_reservation_id INT,
    p_new_status VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE reservation
    SET status = p_new_status
    WHERE id = p_reservation_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rezervace s ID % nenalezena', p_reservation_id;
    END IF;
END;
$$;

-- Procedura: Hromadné zdražení letů v kategorii
CREATE OR REPLACE PROCEDURE sp_increase_category_prices(
    p_category_id INT,
    p_percentage DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE trip
    SET price = price * (1 + (p_percentage / 100))
    WHERE category_id = p_category_id;
END;
$$;

-- 5. TRIGGERS - 2x

-- Trigger: Auditování změny ceny letu (Logování do tabulky trip_price_audit)
CREATE OR REPLACE FUNCTION trg_func_audit_trip_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price <> OLD.price THEN
        INSERT INTO trip_price_audit (trip_id, old_price, new_price)
        VALUES (OLD.id, OLD.price, NEW.price);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_trip_price
AFTER UPDATE OF price ON trip
FOR EACH ROW
EXECUTE FUNCTION trg_func_audit_trip_price();

-- Trigger: Automatický přepočet celkové ceny rezervace při změně položek
CREATE OR REPLACE FUNCTION trg_func_update_reservation_total()
RETURNS TRIGGER AS $$
DECLARE
    v_res_id INT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_res_id := OLD.reservation_id;
    ELSE
        v_res_id := NEW.reservation_id;
    END IF;

    -- Aktualizace celkové částky přes připravenou funkci
    UPDATE reservation
    SET total_price = calculate_total_price(v_res_id)
    WHERE id = v_res_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_reservation_total
AFTER INSERT OR UPDATE OR DELETE ON reservation_item
FOR EACH ROW
EXECUTE FUNCTION trg_func_update_reservation_total();

-- 6. PRÁVA UŽIVATELE (Dedikovaný uživatel)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'skytours_app') THEN
      CREATE ROLE skytours_app LOGIN PASSWORD 'app_password';
   END IF;
END
$do$;

GRANT USAGE ON SCHEMA public TO skytours_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO skytours_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO skytours_app;

-- 7. VLOŽENÍ VÝCHOZÍCH DAT (Seedy)
-- Základní role
INSERT INTO role (name) VALUES ('ROLE_ADMIN'), ('ROLE_USER') ON CONFLICT DO NOTHING;

-- Administrátorský účet (heslo je pro ukázku v plain textu nebo BCrypt hashi podle logiky aplikace - pro teď admin123 hash z BCrypt "admin")
-- $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKKfS0eOHTeRj9nPxuC je vygenerovaný BCrypt pro "admin"
INSERT INTO app_user (role_id, username, password, email)
VALUES (
    (SELECT id FROM role WHERE name = 'ROLE_ADMIN'),
    'admin',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGKKfS0eOHTeRj9nPxuC',
    'admin@skytours.com'
) ON CONFLICT DO NOTHING;

-- Běžný uživatel s heslem "user" (hash: $2a$10$k1wX7G4qD/yL.FpWJ5/H.O9e3m2m/K9x9n0N3M5D8L8vW1B7K1XhW)
INSERT INTO app_user (role_id, username, password, email)
VALUES (
    (SELECT id FROM role WHERE name = 'ROLE_USER'),
    'zakaznik',
    '$2a$10$k1wX7G4qD/yL.FpWJ5/H.O9e3m2m/K9x9n0N3M5D8L8vW1B7K1XhW',
    'zakaznik@skytours.com'
) ON CONFLICT DO NOTHING;

-- Testovací data pro e-shop (Lokace, Kategorie, Lety)

-- Lokace (letiště)
INSERT INTO location (name, city, gps_coordinates) VALUES
('Letiště Hradec Králové', 'Hradec Králové', '50.2458, 15.8450'),
('Letiště Václava Havla', 'Praha', '50.1008, 14.2600'),
('Letiště Brno-Tuřany', 'Brno', '49.1513, 16.6944')
ON CONFLICT DO NOTHING;

-- Kategorie letů
INSERT INTO trip_category (name, description) VALUES
('Vyhlídkové lety', 'Klidné lety pro milovníky krásných výhledů.'),
('Adrenalinové lety', 'Akrobacie a rychlost pro ty, kteří hledají vzrušení.'),
('Pilotem na zkoušku', 'Vyzkoušejte si pilotování letadla pod dohledem instruktora.')
ON CONFLICT DO NOTHING;

-- Lety (Produkty) s využitím JSONB
INSERT INTO trip (category_id, location_id, name, description, price, specs, image_path) VALUES
(
    (SELECT id FROM trip_category WHERE name = 'Vyhlídkové lety'),
    (SELECT id FROM location WHERE city = 'Hradec Králové'),
    'Romantika nad Orlickými horami',
    'Užijte si 45 minut letu nad krásnou přírodou Orlických hor s možností focení z paluby.',
    4500.00,
    '{"duration_min": 45, "max_passengers": 3, "aircraft": "Cessna 172"}',
    NULL
),
(
    (SELECT id FROM trip_category WHERE name = 'Adrenalinové lety'),
    (SELECT id FROM location WHERE city = 'Brno'),
    'Akrobatický let ve Zlín Z-142',
    'Zažijte přetížení a akrobatické prvky, které vás zarazí do sedačky!',
    7200.00,
    '{"duration_min": 20, "max_passengers": 1, "aircraft": "Zlín Z-142", "g_force": "až +4G/-2G"}',
    NULL
),
(
    (SELECT id FROM trip_category WHERE name = 'Pilotem na zkoušku'),
    (SELECT id FROM location WHERE city = 'Praha'),
    'Staň se pilotem na den',
    'Po krátkém brífinku si sednete na místo prvního pilota a převezmete řízení.',
    9500.00,
    '{"duration_min": 60, "max_passengers": 1, "aircraft": "Diamond DA40", "instructor_included": true}',
    NULL
),
(
    (SELECT id FROM trip_category WHERE name = 'Vyhlídkové lety'),
    (SELECT id FROM location WHERE city = 'Praha'),
    'Noční Praha z ptačí perspektivy',
    'Fascinující pohled na osvětlené hlavní město z pohodlí moderního letadla.',
    6000.00,
    '{"duration_min": 40, "max_passengers": 3, "aircraft": "Cessna 172", "night_flight": true}',
    NULL
)
ON CONFLICT DO NOTHING;