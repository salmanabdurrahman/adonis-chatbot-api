import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected schemaName = 'chatbot'
  protected tableName = 'messages'

  public async up() {
    this.schema.withSchema(this.schemaName).createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('conversation_id')
        .notNullable()
        .references('id')
        .inTable(`${this.schemaName}.conversations`)
        .onDelete('CASCADE')
      table.enum('sender_type', ['user', 'bot']).notNullable()
      table.text('message').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.withSchema(this.schemaName).dropTable(this.tableName)
  }
}
