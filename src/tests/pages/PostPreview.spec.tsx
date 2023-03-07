import { render, screen, fireEvent } from '@testing-library/react'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { createClient } from '../../services/prismic'

jest.mock('next/router')
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
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false] as any)

    render(<PostPreview post={post} />)
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when the user has a subscription', async () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription',
        expires: null
      },
      status: 'authenticated'
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<PostPreview post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-post')
  })

  it('loads initial data', async () => {
    const createClientMocked = jest.mocked(createClient)

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

    const response = await getStaticProps({
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
