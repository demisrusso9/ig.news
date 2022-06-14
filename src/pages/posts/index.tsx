import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { RichText } from 'prismic-dom'
import { createClient } from '../../services/prismic'
import styles from './styles.module.scss'

type Post = {
  slug: string
  title: string
  excerpt: string
  updated_at: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData })

  const documents = await client.getByType('post', {
    pageSize: 100
  })

  const posts = documents.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find(content => content.type === 'paragraph')?.text ??
        '',
      updated_at: new Date(post.last_publication_date).toLocaleDateString(
        'pt-Br',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
      )
    }
  })

  return {
    props: { posts } // Will be passed to the page component as props
  }
}
