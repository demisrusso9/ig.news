import { render, screen, fireEvent } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { createClient } from '../../services/prismic'

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {
    const posts = [
      {
        slug: 'my-post',
        title: 'My Post',
        excerpt: 'Post Excerpt',
        updated_at: '01-05-2025'
      }
    ]

    render(<Posts posts={posts} />)

    expect(screen.getByText('My Post')).toBeInTheDocument()
    expect(screen.getByText('Post Excerpt')).toBeInTheDocument()
    expect(screen.getByText('01-05-2025')).toBeInTheDocument()
  })

  it('load initial data', async () => {
    const createClientMock = jest.mocked(createClient)

    createClientMock.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-slug',
            data: {
              title: [
                {
                  type: 'heading1',
                  text: 'my-new-title'
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
          }
        ]
      })
    } as any)

    const response = await getStaticProps({ previewData: undefined })

    expect(response).toEqual({
      props: {
        posts: [
          {
            slug: 'my-new-slug',
            title: 'my-new-title',
            excerpt: 'my-new-content',
            updated_at: '12 de março de 2023'
          }
        ]
      }
    })
  })
})
