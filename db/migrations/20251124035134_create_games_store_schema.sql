/*
  # PS4 Games Store Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `games`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `genre` (text)
      - `release_date` (date)
      - `rating` (decimal)
      - `publisher` (text)
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `game_id` (uuid, references games)
      - `quantity` (integer)
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `total_amount` (decimal)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `game_id` (uuid, references games)
      - `price` (decimal)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for games
    - Restricted access for cart, orders, and profiles

  3. Sample Data
    - Populate games table with sample PS4 games
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  genre text NOT NULL,
  release_date date,
  rating decimal(3,1) DEFAULT 0,
  publisher text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

INSERT INTO games (title, description, price, image_url, genre, release_date, rating, publisher) VALUES
  ('God of War', 'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.', 39.99, 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg', 'Action-Adventure', '2018-04-20', 9.5, 'Sony Interactive Entertainment'),
  ('The Last of Us Part II', 'Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming.', 59.99, 'https://images.pexels.com/photos/7887821/pexels-photo-7887821.jpeg', 'Action-Adventure', '2020-06-19', 9.2, 'Sony Interactive Entertainment'),
  ('Spider-Man', 'Spider-Men, Peter Parker and Miles Morales, return for an exciting new adventure in the critically acclaimed Marvel''s Spider-Man franchise.', 49.99, 'https://images.pexels.com/photos/1637439/pexels-photo-1637439.jpeg', 'Action-Adventure', '2018-09-07', 9.0, 'Sony Interactive Entertainment'),
  ('Horizon Zero Dawn', 'Experience Aloy''s legendary quest to unravel the mysteries of a future Earth ruled by Machines.', 44.99, 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg', 'Action RPG', '2017-02-28', 8.9, 'Sony Interactive Entertainment'),
  ('Uncharted 4', 'Several years after his last adventure, retired fortune hunter, Nathan Drake, is forced back into the world of thieves.', 39.99, 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg', 'Action-Adventure', '2016-05-10', 9.3, 'Sony Interactive Entertainment'),
  ('Bloodborne', 'Hunt your nightmares as you search for answers in the ancient city of Yharnam, now cursed with a strange endemic illness.', 34.99, 'https://images.pexels.com/photos/1585315/pexels-photo-1585315.jpeg', 'Action RPG', '2015-03-24', 9.1, 'Sony Interactive Entertainment'),
  ('Ghost of Tsushima', 'In the late 13th century, the Mongol empire has laid waste to entire nations along their campaign to conquer the East.', 59.99, 'https://images.pexels.com/photos/1601774/pexels-photo-1601774.jpeg', 'Action-Adventure', '2020-07-17', 9.4, 'Sony Interactive Entertainment'),
  ('Red Dead Redemption 2', 'After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee.', 59.99, 'https://images.pexels.com/photos/163077/mario-yoschi-figures-funny-163077.jpeg', 'Action-Adventure', '2018-10-26', 9.7, 'Rockstar Games'),
  ('Final Fantasy VII Remake', 'A spectacular re-imagining of one of the most visionary games ever, Final Fantasy VII Remake rebuilds and expands upon the legendary RPG.', 54.99, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'Action RPG', '2020-04-10', 8.8, 'Square Enix'),
  ('Persona 5 Royal', 'Prepare for an all-new RPG experience in Persona 5 Royal based in the universe of the award-winning series, Persona!', 49.99, 'https://images.pexels.com/photos/3945657/pexels-photo-3945657.jpeg', 'JRPG', '2019-10-31', 9.5, 'Atlus'),
  ('Death Stranding', 'From legendary game creator Hideo Kojima comes a genre-defying experience, now expanded in this definitive Director''s Cut.', 39.99, 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg', 'Action', '2019-11-08', 8.5, 'Sony Interactive Entertainment'),
  ('Resident Evil 2', 'A deadly virus engulfs the residents of Raccoon City in September of 1998, plunging the city into chaos as flesh eating zombies roam the streets.', 39.99, 'https://images.pexels.com/photos/1637439/pexels-photo-1637439.jpeg', 'Survival Horror', '2019-01-25', 9.0, 'Capcom');
