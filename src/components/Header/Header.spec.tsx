import { render, screen } from '@testing-library/react'
import { Header } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

describe('Header component', () => {
  it('renders correctly', () => {
    render(<Header />)

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Posts' })).toBeInTheDocument()
  })
})
