import { GetStaticProps } from 'next'
import Head from 'next/head'
import { createClient } from '../../services/prismic'
import styles from './styles.module.scss'

interface PostsProps {
  posts: {}
}

export default function Posts({ posts }) {
  console.log(posts)
  return (
    <>
      <Head>
        <title>Posts | Ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href='#'>
            <time>12 de março de 1999</time>
            <strong>
              Mark Share Copy How We Can Overcome a Lust-Filled World
            </strong>
            <p>
              Perhaps you have felt something similar. Dan’s struggle is common.
            </p>
          </a>

          <a href='#'>
            <time>12 de março de 1999</time>
            <strong>
              Mark Share Copy How We Can Overcome a Lust-Filled World
            </strong>
            <p>
              Perhaps you have felt something similar. Dan’s struggle is common.
            </p>
          </a>

          <a href='#'>
            <time>12 de março de 1999</time>
            <strong>
              Mark Share Copy How We Can Overcome a Lust-Filled World
            </strong>
            <p>
              Perhaps you have felt something similar. Dan’s struggle is common.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData })
  console.log({ client })
  const documents = await client.getByType('post', {
    pageSize: 100
  })

  return {
    props: { posts: documents.results } // Will be passed to the page component as props
  }
}
