import { render, screen, fireEvent } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getSession } from 'next-auth/react'
import { createClient } from '../../services/prismic'

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const post = {
  slug: 'my-post',
  title: 'My Post',
  content: 'Post Excerpt',
  updatedAt: '01-05-2025'
}

describe('Post Component', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)
    expect(screen.getByText('My Post')).toBeInTheDocument()
  })

  it('redirects when user does not have a subscription', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    } as any)

    const response = await getServerSideProps({} as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('loads initial data', async () => {
    const createClientMocked = jest.mocked(createClient)
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    createClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading1',
              text: 'my-post-title'
            }
          ],
          content: [
            {
              type: 'paragraph',
              text: 'my-new-content'
            }
          ]
        },
        last_publication_date: '03-12-2023'
      })
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'my-post-slug'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-post-slug',
            title: 'my-post-title',
            content: '<p>my-new-content</p>',
            updatedAt: '12 de março de 2023'
          }
        }
      })
    )
  })
})
