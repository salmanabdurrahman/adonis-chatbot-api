import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '1d',
      })

      return response.ok({
        message: 'Login berhasil',
        token,
      })
    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_PASSWORD') {
        return response.unauthorized({
          message: 'Email atau password salah',
        })
      }

      console.error('Error occurred while logging in:', error.response?.data || error.message)

      return response.internalServerError({
        message: 'Terjadi kesalahan saat login',
        error: error.message,
      })
    }
  }
}
