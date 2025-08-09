import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class ApiKeyAuth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const apiKey = request.header('x-api-key')
    const secretKey = Env.get('API_KEY')

    if (!apiKey || apiKey !== secretKey) {
      return response.unauthorized({ message: 'Akses ditolak. API Key tidak valid.' })
    }

    await next()
  }
}
