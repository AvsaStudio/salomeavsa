BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  public_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  access_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'cancelled')),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS public_id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS access_token UUID DEFAULT gen_random_uuid();

UPDATE orders SET public_id = gen_random_uuid() WHERE public_id IS NULL;
UPDATE orders SET access_token = gen_random_uuid() WHERE access_token IS NULL;

ALTER TABLE orders
  ALTER COLUMN public_id SET NOT NULL,
  ALTER COLUMN access_token SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_public_id_index ON orders(public_id);
CREATE UNIQUE INDEX IF NOT EXISTS orders_access_token_index ON orders(access_token);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS add_ons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
  product_name VARCHAR(100) NOT NULL,
  size VARCHAR(20) NOT NULL CHECK (size IN ('Small', 'Medium', 'Large')),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_item_add_ons (
  order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  add_on_id INTEGER NOT NULL REFERENCES add_ons(id),
  price_at_purchase NUMERIC(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
  PRIMARY KEY (order_item_id, add_on_id)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_index
  ON order_items(order_id);

INSERT INTO menu_items (name, base_price) VALUES
  ('Espresso', 3.50),
  ('Americano', 4.00),
  ('Cappuccino', 4.50),
  ('Latte', 5.00),
  ('Flat White', 5.00),
  ('Cortado', 4.50),
  ('Mocha', 5.50),
  ('Cold Brew', 5.50),
  ('Iced Latte', 5.50),
  ('Matcha Latte', 5.50)
ON CONFLICT (name) DO UPDATE SET base_price = EXCLUDED.base_price;

INSERT INTO add_ons (name, price) VALUES
  ('Extra shot', 0.75),
  ('Oat milk', 0.50),
  ('Vanilla syrup', 0.50),
  ('Caramel syrup', 0.50)
ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price;

COMMIT;
