export const seed = async (knex) => {
  await knex('order_items').del()
  await knex('orders').del()
  await knex('menu_items').del()
  await knex('categories').del()
  await knex('users').del()

  const categories = await knex('categories')
    .insert([
      { name: 'Meat Combos',       description: 'Sharing platters with meat dishes on injera',    display_order: 1 },
      { name: 'Vegetarian Combos', description: 'Sharing platters with vegan dishes on injera',   display_order: 2 },
      { name: 'Mixed Combos',      description: 'Meat and vegetarian together on one platter',    display_order: 3 },
      { name: 'Meat Dishes',       description: 'Traditional Ethiopian meat specialties',          display_order: 4 },
      { name: 'Vegetarian',        description: 'Plant-based Ethiopian classics',                 display_order: 5 },
      { name: 'Starters',          description: 'Light bites to begin your meal',                 display_order: 6 },
      { name: 'Desserts',          description: 'Sweet endings',                                  display_order: 7 },
      { name: 'Drinks',            description: 'Traditional and modern beverages',               display_order: 8 },
    ])
    .returning('*')

  const by = Object.fromEntries(categories.map((c) => [c.name, c.id]))

  await knex('menu_items').insert([
    // Meat Combos
    { category_id: by['Meat Combos'], name: 'Meat Combination',      description: "A generous assortment of Ethiopia's favorite meat dishes served on fresh injera.",          price: 850,  image_url: '/images/meat-combo.jpg',         is_spicy: true,       is_featured: true },
    { category_id: by['Meat Combos'], name: 'Family Meat Combo',     description: 'A large sharing platter featuring a variety of meat specialties.',                          price: 1600, image_url: '/images/family-meat-combo.jpg',  is_spicy: true,       is_featured: true },

    // Vegetarian Combos
    { category_id: by['Vegetarian Combos'], name: 'Vegetarian Combination', description: 'A delicious assortment of traditional Ethiopian vegan dishes served on fresh injera.', price: 620, image_url: '/images/vegetarian-combo.jpg', is_vegetarian: true, is_featured: true },
    { category_id: by['Vegetarian Combos'], name: 'Beyaynetu',              description: 'A colorful selection of lentils, vegetables, and greens seasoned with authentic Ethiopian spices.', price: 580, image_url: '/images/beyaynetu.jpg', is_vegetarian: true, is_featured: true },

    // Mixed Combos
    { category_id: by['Mixed Combos'], name: 'Meat & Vegetarian Combination', description: 'A perfect balance of traditional meat and vegetarian favorites served on one platter.', price: 920,  image_url: '/images/mixed-combo.jpg',         is_featured: true },
    { category_id: by['Mixed Combos'], name: 'House Special Combination',     description: 'Our signature platter featuring the best of Ethiopian cuisine.',                        price: 1100, image_url: '/images/house-special-combo.jpg', is_featured: true },

    // Meat Dishes
    { category_id: by['Meat Dishes'], name: 'Doro Wot',      description: "Ethiopia's famous spicy chicken stew slow-cooked in rich berbere sauce.",              price: 420, image_url: '/images/doro-wat.jpg',      is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Key Wot',        description: 'Tender beef simmered in a rich and spicy berbere sauce.',                             price: 400, image_url: '/images/key-wat.jpg',        is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Tibs',           description: 'Tender beef sautéed with onions, tomatoes, peppers, and Ethiopian spices.',           price: 380, image_url: '/images/tibs.jpg',           is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Derek Tibs',     description: 'Crispy fried beef cubes seasoned with aromatic herbs and spices.',                    price: 400, image_url: '/images/derek-tibs.jpg',     is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Zilzil Tibs',    description: 'Strips of beef sautéed with onions, tomatoes, and green peppers.',                   price: 400, image_url: '/images/zilzil-tibs.jpg',    is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Kitfo',          description: 'Finely minced premium beef seasoned with spiced butter and mitmita.',                 price: 450, image_url: '/images/kitfo.jpg',          is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Special Kitfo',  description: 'Our signature kitfo prepared with traditional spices and served with classic accompaniments.', price: 550, image_url: '/images/special-kitfo.jpg', is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Gored Gored',    description: 'Fresh cubed raw beef seasoned with spiced butter and Ethiopian spices.',              price: 430, image_url: '/images/gored-gored.jpg',    is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Kurt',           description: 'Premium slices of fresh raw beef served with mitmita and ayib.',                      price: 420, image_url: '/images/kurt.jpg',           is_spicy: true },
    { category_id: by['Meat Dishes'], name: 'Kikil',          description: 'Slow-cooked beef with bone in a mildly seasoned broth.',                              price: 380, image_url: '/images/kikil.jpg' },
    { category_id: by['Meat Dishes'], name: 'Gomen Besiga',   description: 'Collard greens cooked with tender beef and traditional Ethiopian spices.',            price: 360, image_url: '/images/gomen-be-siga.jpg' },
    { category_id: by['Meat Dishes'], name: 'Quanta Firfir',  description: 'Pieces of injera mixed with spicy dried beef stew and berbere sauce.',               price: 350, image_url: '/images/quanta-firfir.jpg',  is_spicy: true },

    // Vegetarian
    { category_id: by['Vegetarian'], name: 'Shiro',         description: 'A rich and creamy chickpea stew seasoned with Ethiopian spices.',                            price: 250, image_url: '/images/shiro.jpg',         is_vegetarian: true },
    { category_id: by['Vegetarian'], name: 'Misir Wot',     description: 'Slow-cooked red lentils simmered in spicy berbere sauce.',                                  price: 250, image_url: '/images/misir-wat.jpg',     is_vegetarian: true, is_spicy: true },
    { category_id: by['Vegetarian'], name: 'Alicha Wot',    description: 'A mild vegetable stew flavored with turmeric, garlic, and ginger.',                         price: 230, image_url: '/images/alicha-wat.jpg',    is_vegetarian: true },
    { category_id: by['Vegetarian'], name: 'Gomen',         description: 'Fresh collard greens sautéed with garlic and traditional spices.',                          price: 220, image_url: '/images/gomen.jpg',         is_vegetarian: true },
    { category_id: by['Vegetarian'], name: 'Atkilt Wot',    description: 'A comforting mix of cabbage, carrots, and potatoes cooked with Ethiopian spices.',          price: 220, image_url: '/images/atkilt-wat.jpg',    is_vegetarian: true },
    { category_id: by['Vegetarian'], name: 'Firfir',        description: 'Pieces of injera mixed with a flavorful berbere sauce and spices.',                         price: 200, image_url: '/images/firfir.jpg',        is_vegetarian: true, is_spicy: true },
    { category_id: by['Vegetarian'], name: 'Enkulal Firfir',description: 'Scrambled eggs mixed with torn injera and Ethiopian spices.',                               price: 230, image_url: '/images/enkulal-firfir.jpg' },
    { category_id: by['Vegetarian'], name: 'Chechebsa',     description: 'Traditional torn flatbread tossed with spiced butter and berbere, a popular breakfast dish.',price: 200, image_url: '/images/chechebsa.jpg',    is_vegetarian: true },

    // Starters
    { category_id: by['Starters'], name: 'Sambusa (Meat)',       description: 'Crispy pastry filled with seasoned beef and traditional Ethiopian spices.',          price: 80,  image_url: '/images/sambusa-meat.jpg',  is_spicy: true },
    { category_id: by['Starters'], name: 'Sambusa (Vegetarian)', description: 'Crispy pastry filled with seasoned lentils and traditional Ethiopian spices.',       price: 70,  image_url: '/images/sambusa-veg.jpg',   is_vegetarian: true },
    { category_id: by['Starters'], name: 'Kategna',              description: 'Toasted injera spread with spiced butter and berbere.',                              price: 90,  image_url: '/images/kategna.jpg',       is_vegetarian: true },
    { category_id: by['Starters'], name: 'Timatim Salad',        description: 'Fresh tomatoes, onions, peppers, and herbs tossed in a light lemon dressing.',      price: 120, image_url: '/images/timatim-salad.jpg', is_vegetarian: true },

    // Desserts
    { category_id: by['Desserts'], name: 'Baklava',     description: 'Layers of flaky pastry filled with nuts and sweetened with honey syrup.', price: 150, image_url: '/images/baklava.jpg',     is_vegetarian: true },
    { category_id: by['Desserts'], name: 'Fruit Salad', description: 'A refreshing mix of seasonal fresh fruits.',                              price: 130, image_url: '/images/fruit-salad.jpg', is_vegetarian: true },

    // Drinks
    { category_id: by['Drinks'], name: 'Ethiopian Coffee',  description: 'Freshly brewed premium Ethiopian coffee with a rich aroma.',                                          price: 80,  image_url: '/images/coffee.jpg',          is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Coffee Ceremony',   description: "Experience Ethiopia's traditional coffee ceremony, freshly roasted and brewed in a jebena.",          price: 200, image_url: '/images/coffee-ceremony.jpg', is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Macchiato',         description: 'Rich espresso topped with smooth steamed milk.',                                                      price: 70,  image_url: '/images/macchiato.jpg',       is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Ethiopian Tea',     description: 'Traditional Ethiopian black tea served hot.',                                                         price: 50,  image_url: '/images/tea.jpg',             is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Fresh Juice',       description: 'Freshly squeezed seasonal fruit juice.',                                                             price: 120, image_url: '/images/fresh-juice.jpg',     is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Spris',             description: 'A colorful layered blend of fresh fruit juices.',                                                    price: 150, image_url: '/images/spris.jpg',           is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Soft Drinks',       description: 'A selection of chilled carbonated beverages.',                                                       price: 60,  image_url: '/images/soft-drinks.jpg',     is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Ambo Mineral Water',description: "Ethiopia's famous naturally carbonated mineral water.",                                               price: 50,  image_url: '/images/ambo.jpg',            is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Tej',               description: 'Traditional Ethiopian honey wine, lightly fermented and subtly sweet.',                              price: 180, image_url: '/images/tej.jpg',             is_vegetarian: true },
    { category_id: by['Drinks'], name: 'Bottled Water',     description: 'Pure still drinking water served chilled.',                                                          price: 40,  image_url: '/images/ambo.jpg',            is_vegetarian: true },
  ])

  await knex('users').insert({
    name:          'Admin',
    email:         'admin@injerahouse.com',
    password_hash: '$2a$10$WUlv7EFoRaxb7i4hsr3FD.Jx5ByuEk389AnxXNLd0LWg69agmmBZa',
    role:          'admin',
    phone:         '+251911234567',
  })

  console.log('✅  Seed complete: 8 categories, 40 menu items, 1 admin user')
}