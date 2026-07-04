export const up = async (knex) => {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('description').nullable()
    table.integer('display_order').defaultTo(0)
    table.boolean('is_active').defaultTo(true)
    table.timestamps(true, true)
  })

  await knex.schema.createTable('menu_items', (table) => {
    table.increments('id').primary()
    table.integer('category_id')
      .unsigned()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL')
      .nullable()
    table.string('name').notNullable()
    table.text('description').nullable()
    table.decimal('price', 10, 2).notNullable()
    table.string('image_url').nullable()
    table.boolean('is_vegetarian').defaultTo(false)
    table.boolean('is_spicy').defaultTo(false)
    table.boolean('is_available').defaultTo(true)
    table.boolean('is_featured').defaultTo(false)
    table.timestamps(true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('menu_items')
  await knex.schema.dropTableIfExists('categories')
}
