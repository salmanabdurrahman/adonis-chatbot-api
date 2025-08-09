import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Conversation from './Conversation'

export type SenderType = 'user' | 'bot'

export default class Message extends BaseModel {
  public static table = 'chatbot.messages'

  @column({ isPrimary: true })
  public id: number

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
