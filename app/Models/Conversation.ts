import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from './Message'
import { v4 as uuidv4 } from 'uuid'

export default class Conversation extends BaseModel {
  public static table = 'chatbot.conversations'

  @beforeCreate()
  public static async assignUuid(conversation: Conversation) {
    conversation.id = uuidv4()
  }

  @column({ isPrimary: true })
  public id: string

  @column()
  public sessionId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>
}
