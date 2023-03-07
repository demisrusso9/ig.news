import { useSession, signIn } from 'next-auth/react'
import styles from './styles.module.scss'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import { useRouter } from 'next/router'

export function SubscribeButton() {
  const { data: session } = useSession()
  const router = useRouter()

  const member = session?.activeSubscription

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session?.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const stripe = await getStripeJs()
      const { sessionId } = await api.post('/subscribe').then(res => res.data)
      
      stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      console.log({err})
    }
  }

  return (
    <button type='button' className={styles.subscribeButton} onClick={handleSubscribe}>
      {member ? 'See Posts' : 'Subscribe now'}
    </button>
  )
}
