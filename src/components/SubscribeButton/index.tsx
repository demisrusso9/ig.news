import { useSession, signIn } from 'next-auth/react'
import styles from './styles.module.scss'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import { useRouter } from 'next/router'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const member = session?.activeSubscription

  async function handleSubscribe() {
    // If not logged
    if (!session) {
      signIn('github')
      return
    }

    if (session?.activeSubscription) {
      router.push('/posts')
      return
    }

    // If logged in, create checkout
    try {
      const stripe = await getStripeJs()
      const { sessionId } = await api.post('/subscribe').then(res => res.data)

      // New to a checkout page
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
      {member ? 'See Posts' : 'Subscribe now'}
    </button>
  )
}
