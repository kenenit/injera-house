export const up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email').unique().notNullable()
    table.string('password_hash').notNullable()
    table.enu('role', ['customer', 'admin']).defaultTo('customer')
    table.string('phone').nullable()
    table.timestamps(true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('users')
}
