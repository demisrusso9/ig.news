import { render, screen, fireEvent } from '@testing-library/react'
import { SignInButton } from '.'
import { useSession, signIn, signOut } from 'next-auth/react'

jest.mock('next-auth/react')

describe('SignInButton component', () => {
  it('renders correctly when the user is not signed in', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(<SignInButton />)

    expect(screen.getByRole('button', { name: 'Sign In with GitHub' })).toBeInTheDocument()
  })

  it('renders correctly when the user is signed in', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com'
        },
        expires: 'fake-expires'
      },
      status: 'authenticated'
    })

    render(<SignInButton />)

    expect(screen.getByRole('button', { name: 'John Doe' })).toBeInTheDocument()
  })

  it('sign in the user when button is clicked', () => {
    const useSessionMocked = jest.mocked(useSession)
    const signInMock = jest.mocked(signIn)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      signIn: signInMock
    } as any)

    render(<SignInButton />)

    const button = screen.getByRole('button', { name: 'Sign In with GitHub' })
    fireEvent.click(button)

    expect(signInMock).toBeCalledWith('github')
  })

  it('sign out user when button is clicked', () => {
    const useSessionMocked = jest.mocked(useSession)
    const signOutMock = jest.mocked(signOut)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe'
        }
      },
      status: 'authenticated',
      signOut: signOutMock
    } as any)

    render(<SignInButton />)

    const button = screen.getByRole('button', { name: 'John Doe' })
    fireEvent.click(button)

    expect(signOutMock).toBeCalled()
  })
})
