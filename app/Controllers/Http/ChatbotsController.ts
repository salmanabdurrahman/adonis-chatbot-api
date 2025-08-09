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
}
