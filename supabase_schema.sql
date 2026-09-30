
-- 1. USERS PROFILE TABLE (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to auto-create public.users on auth.users sign-up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.created_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PLACES TABLE (Karachi destinations)

CREATE TABLE IF NOT EXISTS public.places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  category TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  entry_cost NUMERIC DEFAULT 0,
  food_cost NUMERIC DEFAULT 0,
  rating NUMERIC NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  duration_hours NUMERIC NOT NULL,
  best_time_window TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  budget_tier TEXT NOT NULL,
  traveler_fit TEXT[] DEFAULT '{}',
  local_tips TEXT[] DEFAULT '{}',
  address TEXT NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,
  must_try_food BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TRIPS TABLE (Generated & Saved user itineraries)

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  duration_type TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  traveler_group TEXT NOT NULL,
  transport_pref TEXT NOT NULL,
  total_cost NUMERIC NOT NULL,
  stops JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TRIP_PLACES TABLE (Relational stops per trip)

CREATE TABLE IF NOT EXISTS public.trip_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  place_id TEXT REFERENCES public.places(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  arrival_time TEXT NOT NULL,
  departure_time TEXT,
  cost NUMERIC NOT NULL,
  transport_cost_to_next NUMERIC DEFAULT 0,
  transport_mode TEXT,
  travel_time_mins INTEGER DEFAULT 0,
  traffic_note TEXT
);

-- 5. SAVED_TRIPS TABLE (Bookmarks / Favorite trips)

CREATE TABLE IF NOT EXISTS public.saved_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, trip_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES


ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

-- Places: Public read, Authenticated insert/update

DROP POLICY IF EXISTS "Public places read" ON public.places;
CREATE POLICY "Public places read" ON public.places FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service and auth insert places" ON public.places;
CREATE POLICY "Service and auth insert places" ON public.places FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service and auth update places" ON public.places;
CREATE POLICY "Service and auth update places" ON public.places FOR UPDATE USING (true);

-- Trips: Allow public read of anonymous/own trips, allow insert

DROP POLICY IF EXISTS "Allow read own trips" ON public.trips;
CREATE POLICY "Allow read own trips" ON public.trips FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);
DROP POLICY IF EXISTS "Allow insert trips" ON public.trips;
CREATE POLICY "Allow insert trips" ON public.trips FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow delete own trips" ON public.trips;
CREATE POLICY "Allow delete own trips" ON public.trips FOR DELETE USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Trip Places:

DROP POLICY IF EXISTS "Allow read trip places" ON public.trip_places;
CREATE POLICY "Allow read trip places" ON public.trip_places FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert trip places" ON public.trip_places;
CREATE POLICY "Allow insert trip places" ON public.trip_places FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow delete trip places" ON public.trip_places;
CREATE POLICY "Allow delete trip places" ON public.trip_places FOR DELETE USING (true);

-- Saved Trips:

DROP POLICY IF EXISTS "Allow read own saved trips" ON public.saved_trips;
CREATE POLICY "Allow read own saved trips" ON public.saved_trips FOR SELECT USING (
  auth.uid() = user_id
);
DROP POLICY IF EXISTS "Allow insert own saved trips" ON public.saved_trips;
CREATE POLICY "Allow insert own saved trips" ON public.saved_trips FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
DROP POLICY IF EXISTS "Allow delete own saved trips" ON public.saved_trips;
CREATE POLICY "Allow delete own saved trips" ON public.saved_trips FOR DELETE USING (
  auth.uid() = user_id
);

-- Users:

DROP POLICY IF EXISTS "Allow read own profile" ON public.users;
CREATE POLICY "Allow read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Allow update own profile" ON public.users;
CREATE POLICY "Allow update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);


-- SEED DATA: 22 REAL KARACHI PLACES


INSERT INTO public.places (
  id, name, area, category, cost, entry_cost, food_cost, rating, description,
  image_url, duration_hours, best_time_window, lat, lng, budget_tier,
  traveler_fit, local_tips, address, is_free, must_try_food
) VALUES
(
  'mohatta-palace',
  'Mohatta Palace Museum',
  'Clifton',
  'heritage',
  450,
  150,
  300,
  4.8,
  'An architectural jewel built in 1927 with pink Jodhpur stone and local yellow Gizri sandstone. Features opulent domes, manicured rose gardens, and rotating art exhibits.',
  'https://images.unsplash.com/photo-1596707325695-1804f98642fd?auto=format&fit=crop&w=800&q=80',
  2,
  'Afternoon',
  24.8142,
  67.0326,
  'low',
  ARRAY['solo', 'couple', 'family', 'friends'],
  ARRAY['Photography inside main galleries is restricted, but courtyard is great for portrait shots.', 'Visit on weekdays around 3:00 PM to avoid Karachi student tour groups.', 'Check basement gift shop for authentic Sindh handicraft souvenirs.'],
  '7 Hatim Alvi Rd, Clifton Block 5, Karachi',
  false,
  false
),
(
  'burns-road',
  'Burns Road Food Street',
  'Saddar',
  'food',
  950,
  0,
  950,
  4.9,
  'Karachi''s historic heart of culinary glory. Famous for melt-in-your-mouth Waheed Bun Kabab, aromatic Delhi Rabri, fragrant spiced Nihari, and freshly fired Seekh Kebabs.',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  2.5,
  'Night',
  24.8569,
  67.0145,
  'low',
  ARRAY['solo', 'friends', 'family'],
  ARRAY['Park near Fresco Chowk and walk inside; the street is pedestrianized in late evenings.', 'Must-eat combo: Waheed Kebab fry kebab with hot tandoori paratha, followed by Delhi Rabri House rabri kulfi.', 'Cash is king here; carry small PKR banknotes.'],
  'Shahrah-e-Liaquat, Burns Road, Saddar, Karachi',
  true,
  true
),
(
  'do-darya',
  'Do Darya Coastal Dining Strip',
  'DHA',
  'food',
  3500,
  0,
  3500,
  4.8,
  'A striking row of open-air waterfront restaurants on wooden stilts over the Arabian Sea. Feast on charcoal mutton karahi and grilled jumbo prawns with waves crashing right beneath your deck.',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  3,
  'Night',
  24.7578,
  67.0784,
  'luxury',
  ARRAY['family', 'couple', 'friends'],
  ARRAY['Call ahead to reserve edge-table seating at Kolachi or Kababjees for prime sea views.', 'DHA Phase 8 is breezy and cool at night; carry a light jacket during winter months.', 'Allow 40 minutes travel time if coming from Saddar or Gulshan via Khayaban-e-Ittehad.'],
  'Captain Farhan Ali Shaheed Rd, Phase 8, DHA, Karachi',
  true,
  true
),
(
  'clifton-beach',
  'Clifton Beach & Sea View',
  'Clifton',
  'beach',
  400,
  0,
  400,
  4.5,
  'The definitive Karachi seaside experience. Golden sands, decorated camel and horseback rides, illuminated dune buggies, and steaming cups of doodh patti chai by the shoreline.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  2,
  'Sunset',
  24.7937,
  67.0371,
  'low',
  ARRAY['solo', 'friends', 'family', 'couple'],
  ARRAY['Arrive around 5:30 PM to catch Karachi''s legendary crimson Arabian Sea sunset.', 'Always negotiate camel and ATV buggy ride fares before hopping on (Rs. 200–300 is standard).', 'Grab roasted spicy corn on the cob (Bhutta) from the beachside vendors.'],
  'Sea View Road, Clifton, Karachi',
  true,
  false
),
(
  'tdf-ghar',
  'TDF Ghar & Heritage Rooftop',
  'Civil Lines',
  'heritage',
  500,
  100,
  400,
  4.7,
  'A restored 1930s residence preserving Karachi''s multicultural cosmopolitan history. The rooftop features handcrafted tiles, a vintage gramophone room, and panoramic views of Quaid''s Mazar.',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
  1.5,
  'Afternoon',
  24.8715,
  67.0421,
  'low',
  ARRAY['solo', 'couple', 'friends'],
  ARRAY['Order their signature cardammon chai with bun muska on the open terrace.', 'Check the Haroon Room and vintage kitchen exhibits for authentic 1940s Karachi relics.'],
  '158 M.A. Jinnah Rd, Soldier Bazaar, Karachi',
  false,
  true
),
(
  'empress-market',
  'Empress Market & Saddar Bazaar',
  'Saddar',
  'bazaars',
  300,
  0,
  300,
  4.6,
  'Constructed during British rule in 1889, this monumental Anglo-Indian Gothic clocktower is Karachi''s bustling ground zero for dry fruits, exotic spices, and historic market vibes.',
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
  2,
  'Morning',
  24.8624,
  67.0272,
  'low',
  ARRAY['solo', 'friends'],
  ARRAY['Best visited between 10:00 AM and 1:00 PM before afternoon Saddar traffic peaks.', 'Pick up fresh Iranian saffron, dry roasted pine nuts (chilgoza), and Pakistani pickles.', 'Keep your phone and wallet in a secure front pocket as pedestrian alleys are crowded.'],
  'Preedy St, Saddar, Karachi',
  true,
  false
),
(
  'mazar-e-quaid',
  'Mazar-e-Quaid (Jinnah Mausoleum)',
  'Civil Lines',
  'heritage',
  150,
  50,
  100,
  4.9,
  'The iconic resting place of Pakistan founder Muhammad Ali Jinnah. Striking pristine white marble structure designed in 1960s modernist style surrounded by a 53-hectare landscaped park.',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
  1.5,
  'Sunset',
  24.8753,
  67.0409,
  'low',
  ARRAY['family', 'solo', 'couple', 'friends'],
  ARRAY['Catch ceremonial Changing of the Guard by Pakistan Military cadets at 4:30 PM.', 'Proper modest dress is required for entry; visitors must deposit shoes at the entrance kiosk.'],
  'M.A. Jinnah Rd, Bohlakar, Karachi',
  false,
  false
),
(
  'frere-hall',
  'Frere Hall & Sadequain Murals',
  'Civil Lines',
  'heritage',
  150,
  0,
  150,
  4.7,
  'A masterpiece of Venetian Gothic architecture dating to 1865, featuring yellow limestone arches and a ceiling mural titled "Arz-o-Samawat" painted by Pakistani legendary artist Sadequain.',
  'https://images.unsplash.com/photo-1548625361-1959737198a0?auto=format&fit=crop&w=800&q=80',
  1.5,
  'Morning',
  24.8488,
  67.0328,
  'low',
  ARRAY['solo', 'couple', 'friends', 'family'],
  ARRAY['Every Sunday, the gardens host Karachi''s famous open-air secondhand book bazaar with rare finds for Rs. 100–500.', 'Lie down on the floor or look up through the ceiling arch to photograph the monumental Sadequain mural.'],
  'Fatima Jinnah Rd, Civil Lines, Karachi',
  true,
  false
),
(
  'port-grand',
  'Port Grand Waterfront Promenade',
  'Kemari / Manora',
  'food',
  1200,
  400,
  800,
  4.6,
  'A pedestrianized seaside boulevard built along the historic Native Jetty Bridge. Offers dozens of food stalls, live open-air music, 60s street lamps, and peaceful views of the Karachi harbor.',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  3,
  'Night',
  24.8385,
  66.9944,
  'balanced',
  ARRAY['family', 'friends', 'couple'],
  ARRAY['The Rs. 400 entry ticket often includes vouchers redeemable inside at food stalls.', 'Take an evening motorboat harbor cruise around the port docks for Rs. 500 per head.'],
  'Native Jetty Bridge, Kemari, Karachi',
  false,
  true
),
(
  'chai-wala-dha',
  'Chai Wala (Chhotu Chaiwala)',
  'DHA',
  'cafes',
  650,
  0,
  650,
  4.7,
  'The pioneer of Karachi upscale dhaba culture. Famous for Kadak Doodh Patti chai, Disco Chai, Nutella paratha, and spicy pizza parathas served under open-air trees.',
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  1.5,
  'Night',
  24.8115,
  67.0621,
  'low',
  ARRAY['friends', 'solo', 'couple'],
  ARRAY['Peak vibe begins after 10:30 PM with live sports screenings and street crowds.', 'Try signature Karak Elaichi Chai alongside a cheese and chicken paratha.'],
  'Shop 5 & 6, Street 4, Badar Commercial, Phase 5 DHA, Karachi',
  true,
  true
),
(
  'manora-island',
  'Manora Island Beach & Lighthouse',
  'Kemari / Manora',
  'adventure',
  1800,
  150,
  650,
  4.8,
  'A peninsula guarding Karachi harbor. Highlights include a historic 19th-century lighthouse, St. Paul''s church, fresh fried fish by the waterfront, and clean paved beach promenades.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  4,
  'Morning',
  24.7951,
  66.9749,
  'balanced',
  ARRAY['friends', 'family', 'solo'],
  ARRAY['Can be accessed by road via Manora Driveway or via a traditional wooden ferry from Kemari Jetty for a nostalgic sea voyage.', 'Order fresh Rohu and Pomfret fish fried on order with spicy Sindhi green chutney.'],
  'Manora Island, Karachi Waterfront',
  false,
  true
),
(
  'boat-basin',
  'Boat Basin Food Strip',
  'Clifton',
  'food',
  850,
  0,
  850,
  4.7,
  'Karachi legendary midnight food capital that literally never sleeps. Home to Nihari, crispy spicy broast, stuffed parathas, and cold ice cream falooda served round the clock.',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  2,
  'Night',
  24.8252,
  67.0268,
  'low',
  ARRAY['friends', 'solo', 'family'],
  ARRAY['Super Nursery paratha roll and Jan Broast are unmissable Karachi institutions here.', 'Traffic is dense around 1:00 AM–3:00 AM; take a rickshaw or park a block away.'],
  'Khayaban-e-Roomi, Block 5, Clifton, Karachi',
  true,
  true
),
(
  'zainab-market',
  'Zainab Market & Rex Centre',
  'Saddar',
  'bazaars',
  2500,
  0,
  400,
  4.5,
  'Karachi prime bargain haven for leather jackets, denim, Pashmina shawls, brass handicrafts, and export overruns. A paradise for smart shoppers who know how to negotiate.',
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
  2.5,
  'Afternoon',
  24.8542,
  67.0289,
  'balanced',
  ARRAY['solo', 'friends', 'family'],
  ARRAY['Rule of thumb: offer 50–60% of the initial quote and meet halfway.', 'The underground floors have great bargains for high-end sheepskin and camel leather goods.'],
  'Abdullah Haroon Rd, Saddar, Karachi',
  true,
  false
),
(
  'paf-museum',
  'Pakistan Air Force (PAF) Museum',
  'Shahrah-e-Faisal',
  'heritage',
  400,
  150,
  250,
  4.8,
  'Sprawling aviation park showcasing vintage fighter aircraft, Mirage jets, Quaid-e-Azam''s personal Vickers Viscount airplane, interactive simulators, and lush green lawns.',
  'https://images.unsplash.com/photo-1548625361-1959737198a0?auto=format&fit=crop&w=800&q=80',
  2.5,
  'Afternoon',
  24.8703,
  67.0987,
  'low',
  ARRAY['family', 'friends', 'solo'],
  ARRAY['Great stop if traveling along Shahrah-e-Faisal with kids; plenty of outdoor green space to relax.', 'Bring original CNIC or photo ID for vehicle gate clearance.'],
  'Shahrah-e-Faisal, Karsaz, Karachi',
  false,
  false
),
(
  'koel-cafe',
  'Koel Cafe & Art Gallery',
  'Clifton',
  'cafes',
  2200,
  0,
  2200,
  4.9,
  'An oasis of tranquility tucked in Clifton. Features a leafy open courtyard with terracotta pots, flowing lotus fountains, organic fusion dining, and an attached contemporary art gallery.',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
  2,
  'Afternoon',
  24.8210,
  67.0345,
  'balanced',
  ARRAY['couple', 'solo', 'friends'],
  ARRAY['Order their signature shikanjabeen (traditional lime mint cooler) and prawn risotto.', 'Walk through the art gallery after lunch; exhibits rotate monthly showcasing local artists.'],
  'F-42/2, Block 4, Clifton, Karachi',
  true,
  true
),
(
  'churna-island',
  'Churna Island Scuba & Snorkeling',
  'Bahria / Outskirts',
  'adventure',
  4500,
  3500,
  1000,
  4.9,
  'Karachi premier marine adventure. A deserted rocky island in the Arabian Sea surrounded by vibrant coral reefs, sea turtles, cliff diving spots, and crystal clear emerald waters.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  6,
  'Morning',
  24.8967,
  66.6083,
  'luxury',
  ARRAY['friends', 'solo'],
  ARRAY['Best season is October to February when Arabian Sea tides are calm and underwater visibility is over 15 meters.', 'Tours depart early morning (6:30 AM) from Mubarak Village with lunch and life jackets included.'],
  'Arabian Sea off Mubarak Village, Hub/Karachi border',
  false,
  false
),
(
  'kolachi-restaurant',
  'Kolachi Seafood & Karahi',
  'DHA',
  'food',
  3200,
  0,
  3200,
  4.9,
  'The undisputed benchmark of Karachi seaside hospitality. Perched over the ocean at Do Darya, famous for signature Paneer Reshmi Handi, charcoal Sajji, and steaming roghni naan.',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  2.5,
  'Night',
  24.7573,
  67.0789,
  'luxury',
  ARRAY['family', 'couple', 'friends'],
  ARRAY['Waiting times on Friday and Saturday nights can reach 45 minutes; arrive by 7:45 PM.', 'Order the Hunza Karahi or Kolachi Special Prawns for the definitive experience.'],
  'Do Darya, Phase 8, DHA, Karachi',
  true,
  true
),
(
  'tariq-road',
  'Tariq Road Shopping & Chaat Strip',
  'PECHS',
  'bazaars',
  1200,
  0,
  600,
  4.6,
  'The beating retail heart of central Karachi. Hundreds of boutiques, jewelry shops, shoe stores, and legendary roadside chaat vendors serving spicy samosa chaat and mixed fruit dahi baray.',
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
  2.5,
  'Afternoon',
  24.8718,
  67.0612,
  'balanced',
  ARRAY['family', 'friends', 'solo'],
  ARRAY['Do not miss the legendary Rehmat-e-Shereen or Zahid Nihari branches nearby.', 'Street parking is difficult; drop off with Careem or Rickshaw at Liberty Chowk.'],
  'Tariq Road, PECHS Block 2, Karachi',
  true,
  true
),
(
  'masjid-e-tooba',
  'Masjid-e-Tooba (Gol Masjid)',
  'DHA',
  'heritage',
  50,
  0,
  50,
  4.8,
  'Known locally as the Gol Masjid (Round Mosque), this 1969 architectural triumph features the world''s largest single-dome mosque constructed with pure white marble without central pillars.',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
  1,
  'Morning',
  24.8398,
  67.0543,
  'low',
  ARRAY['solo', 'family', 'couple'],
  ARRAY['The acoustics inside are breathtaking; even a whisper echoes softly across the dome.', 'Surrounded by pristine green lawns; quiet and respectful atmosphere maintained.'],
  'Old Korangi Rd, Phase 2, DHA, Karachi',
  true,
  false
),
(
  'arena-recreation',
  'Arena Family Recreation & Bowling',
  'Shahrah-e-Faisal',
  'adventure',
  2400,
  1200,
  1200,
  4.6,
  'Karachi''s foremost indoor entertainment complex featuring international standard 16-lane bowling, indoor ice skating, rock climbing wall, virtual arcade, and buffet restaurant.',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  3,
  'Afternoon',
  24.8732,
  67.0912,
  'balanced',
  ARRAY['family', 'friends'],
  ARRAY['Great retreat on hot summer afternoons with powerful air-conditioning and family bowling alleys.', 'Combo bowling + arcade passes save around 25% compared to individual tickets.'],
  'FEC-01, Habib Ibrahim Rehmatullah Rd, Karsaz, Karachi',
  false,
  false
),
(
  'al-bustan-pc',
  'Al-Bustan Luxury Buffet (Pearl Continental)',
  'Civil Lines',
  'food',
  4800,
  0,
  4800,
  4.7,
  'Premier fine dining and lavish Pakistani & continental buffet situated in Karachi''s historic landmark 5-star hotel. Features live cooking stations, carving roasts, and grand dessert spreads.',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  2,
  'Night',
  24.8465,
  67.0278,
  'luxury',
  ARRAY['couple', 'family'],
  ARRAY['Smart casual dress code strictly enforced.', 'Ideal for milestone celebrations or upscale dining after touring Saddar and Frere Hall.'],
  'Club Rd, Civil Lines, Karachi',
  false,
  true
),
(
  'national-museum',
  'National Museum of Pakistan',
  'Saddar',
  'heritage',
  150,
  50,
  100,
  4.5,
  'Preserving over 5,000 years of Indus Valley civilization history. Highlights include the genuine Priest-King stone bust from Mohenjo-Daro, ancient Gandhara Buddhist relics, and rare Mughal manuscripts.',
  'https://images.unsplash.com/photo-1548625361-1959737198a0?auto=format&fit=crop&w=800&q=80',
  2,
  'Morning',
  24.8561,
  67.0211,
  'low',
  ARRAY['solo', 'family', 'friends'],
  ARRAY['The Indus Valley seal gallery and Quranic calligraphy room are world-class.', 'Located inside Burns Garden; quiet shaded courtyard to escape the city noise.'],
  'Burns Garden, Dr. Ziauddin Ahmed Rd, Saddar, Karachi',
  false,
  false
)
ON CONFLICT (id) DO NOTHING;
