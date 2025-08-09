import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Conversation from 'App/Models/Conversation'
import CreateQuestionValidator from 'App/Validators/CreateQuestionValidator'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default class ChatbotsController {
  public async sendMessage({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateQuestionValidator)
    const userQuestion = payload.question

    const sessionId = payload.session_id || uuidv4()
    const trx = await Database.transaction()

    try {
      const conversation = await Conversation.firstOrCreate(
        { sessionId },
        { sessionId },
        { client: trx }
      )

      await conversation.related('messages').create(
        {
          senderType: 'user',
          message: userQuestion,
        },
        { client: trx }
      )

      const externalApiUrl =
        'https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message'

      const apiResponse = await axios.post(externalApiUrl, {
        question: userQuestion,
        session_id: sessionId,
      })

      const botAnswer =
        apiResponse.data?.data?.message?.[0]?.text || 'Maaf, saya tidak bisa menjawab saat ini.'

      const botMessage = await conversation.related('messages').create({
        senderType: 'bot',
        message: botAnswer,
      })

      await trx.commit()

      return response.ok({
        session_id: conversation.sessionId,
        your_question: userQuestion,
        bot_answer: botMessage.message,
      })
    } catch (error) {
      await trx.rollback()

      console.error('Error occurred while sending message:', error.response?.data || error.message)

      return response.internalServerError({
        message: 'Terjadi kesalahan saat memproses permintaan Anda.',
        error: error.message,
      })
    }
  }

  public async getConversations({ request, response }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const conversations = await Conversation.query()
        .preload('messages', (messageQuery) => {
          messageQuery.orderBy('createdAt', 'asc')
        })
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return response.ok(conversations.toJSON())
    } catch (error) {
      console.error(
        'Error occurred while fetching conversations:',
        error.response?.data || error.message
      )

      return response.internalServerError({
        message: 'Terjadi kesalahan saat memproses permintaan Anda.',
        error: error.message,
      })
    }
  }

  public async getConversationById({ request, response }: HttpContextContract) {
    try {
      const conversationId = request.param('id')

      const conversation = await Conversation.query()
        .preload('messages', (messageQuery) => {
          messageQuery.orderBy('createdAt', 'asc')
        })
        .where('id', conversationId)
        .firstOrFail()

      return response.ok(conversation.toJSON())
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Percakapan tidak ditemukan.' })
      }

      console.error(
        'Error occurred while fetching conversation by ID:',
        error.response?.data || error.message
      )

      return response.internalServerError({
        message: 'Terjadi kesalahan saat memproses permintaan Anda.',
        error: error.message,
      })
    }
  }
}
