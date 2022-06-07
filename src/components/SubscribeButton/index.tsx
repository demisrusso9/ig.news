import { useSession, signIn } from 'next-auth/react'
import styles from './styles.module.scss'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession()

  // If not logged
  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    // If logged in, create checkout
    try {
      const { sessionId } = await api.post('/subscribe').then(res => res.data)

      const stripe = await getStripeJs()
      stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <button
      type='button'
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
