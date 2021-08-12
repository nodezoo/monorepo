

class Shared {
  static async isPremiumUser({ user_id }, { seneca }) {
    const out = await seneca.post('role:user,is:premium', { user_id })

    if (!out.ok) {
      throw new Error("Failed to retrieve the user's subscription status")
    }

    const { data: { is_premium } } = out

    return is_premium
  }
}


module.exports = Shared
