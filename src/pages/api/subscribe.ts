import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/faunadb'
import { stripe } from '../../services/stripes'

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Only POST allowed for Creation
  if (req.method === 'POST') {
    // Get session from cookies
    const session = await getSession({ req })

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email)))
    )

    let customerId = user.data.stripe_customer_id

    // Create a user on the STRIPE platform
    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id
          }
        })
      )

      customerId = stripeCustomer.id
    }

    // Create a STRIPE session for payment
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1L6JaRCZNpW5VJI5ktZ8cFv0',
          quantity: 1
        }
      ],
      allow_promotion_codes: true,
      mode: 'subscription',
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method now allowed')
  }
}
