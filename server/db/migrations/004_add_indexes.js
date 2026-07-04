export const up = async (knex) => {
  await knex.schema.table('menu_items', (table) => {
    table.index('category_id')
    table.index('is_available')
    table.index('is_featured')
  })

  await knex.schema.table('orders', (table) => {
    table.index('tracking_code')
    table.index('status')
    table.index('user_id')
    table.index('created_at')
  })

  await knex.schema.table('order_items', (table) => {
    table.index('order_id')
  })
}

export const down = async (knex) => {
  await knex.schema.table('menu_items', (table) => {
    table.dropIndex('category_id')
    table.dropIndex('is_available')
    table.dropIndex('is_featured')
  })

  await knex.schema.table('orders', (table) => {
    table.dropIndex('tracking_code')
    table.dropIndex('status')
    table.dropIndex('user_id')
    table.dropIndex('created_at')
  })

  await knex.schema.table('order_items', (table) => {
    table.dropIndex('order_id')
  })
}
