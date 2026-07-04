export const up = async (knex) => {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary()
    table.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .nullable()

    // Customer snapshot (works for guests too)
    table.string('customer_name').notNullable()
    table.string('customer_phone').notNullable()
    table.string('customer_email').nullable()

    // Delivery
    table.enu('order_type', ['delivery', 'pickup']).defaultTo('delivery')
    table.text('delivery_address').nullable()

    // Status lifecycle
    table.enu('status', [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'delivered',
      'cancelled',
    ]).defaultTo('pending')

    table.decimal('subtotal', 10, 2).notNullable()
    table.decimal('delivery_fee', 10, 2).defaultTo(0)
    table.decimal('total', 10, 2).notNullable()
    table.text('notes').nullable()

    // Human-readable tracking code e.g. IH-20240001
    table.string('tracking_code').unique().notNullable()

    table.timestamps(true, true)
  })

  await knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary()
    table.integer('order_id')
      .unsigned()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE')
      .notNullable()
    table.integer('menu_item_id')
      .unsigned()
      .references('id')
      .inTable('menu_items')
      .onDelete('SET NULL')
      .nullable()

    // Snapshot name + price at time of order (menu may change later)
    table.string('item_name').notNullable()
    table.decimal('item_price', 10, 2).notNullable()
    table.integer('quantity').notNullable().defaultTo(1)
    table.decimal('line_total', 10, 2).notNullable()

    table.timestamps(true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('order_items')
  await knex.schema.dropTableIfExists('orders')
}
