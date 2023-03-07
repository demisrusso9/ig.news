import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SubscribeButton } from '.'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('axios')
jest.mock('../../services/api')

describe('SubscribeButton component', () => {
  it('calls api post', async () => {
    const getSpy = jest.spyOn(axios, 'post')
    const useSessionMocked = jest.mocked(useSession)

    // User logged in
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com'
        },
        activeSubscription: null,
        expires: 'fake-expires'
      },
      status: 'authenticated'
    })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    await waitFor(() => expect(getSpy).toHaveBeenCalledWith('/api/subscribe'))
  })




  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false] as any)

    render(<SubscribeButton />)

    expect(screen.getByRole('button', { name: 'Subscribe now' })).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = jest.mocked(signIn)
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false] as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByRole('button', { name: 'Subscribe now' })
    fireEvent.click(subscribeButton)

    expect(signInMocked).toBeCalledWith('github')
  })

  it('redirects to user posts when user already has a subscription', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const useSessionMocked = jest.mocked(useSession)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com'
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      },
      status: 'authenticated'
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByRole('button', { name: 'See Posts' })
    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})
