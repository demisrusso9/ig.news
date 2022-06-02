import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripes'
import { formatPrice } from '../utils/formatPrice'
import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>
            News about the <span>React</span> world.
          </h1>

          <p>
            Get access to all publications for <br />
            <span>for {formatPrice(product.amount)} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src='/images/avatar.svg' alt='Girl codding' />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1L6JaRCZNpW5VJI5ktZ8cFv0', {
    expand: ['product'] // To get all information about the product price
  })

  const product = {
    priceId: price.id,
    amount: price.unit_amount / 100
  }

  return {
    props: {
      product
    }
  }
}
