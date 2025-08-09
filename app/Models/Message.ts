import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Conversation from './Conversation'
import { v4 as uuidv4 } from 'uuid'

export type SenderType = 'user' | 'bot'

export default class Message extends BaseModel {
  public static table = 'chatbot.messages'

  @beforeCreate()
  public static async assignUuid(message: Message) {
    message.id = uuidv4()
  }

  @column({ isPrimary: true })
  public id: string

  @column()
  public conversationId: string

  @column()
  public senderType: SenderType

  @column()
  public message: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Conversation)
  public conversation: BelongsTo<typeof Conversation>
}
