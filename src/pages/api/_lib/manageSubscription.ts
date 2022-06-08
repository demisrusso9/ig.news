import { fauna } from '../../../services/faunadb'
import { query as q } from 'faunadb'
import { stripe } from '../../../services/stripes'

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  // Get in the FaunaDB the user id {customerId}
  // Save subscription data on the FaunaDB

  // Get the user REF (id) on the Collection user
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId))
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  // Create a new subscription
  if (createAction) {
    await fauna.query(
      q.Create(q.Collection('subscriptions'), { data: subscriptionData })
    )
  } else {
    // Update a existing subscription
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId))
        ),
        { data: subscriptionData }
      )
    )
  }
}
