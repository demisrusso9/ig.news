import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {
  it('renders correctly', () => {
    render(
      <ActiveLink href='/' active='active'>
        <a>TestHome</a>
      </ActiveLink>
    )

    expect(screen.getByRole('link', { name: 'TestHome' })).toBeInTheDocument()
  })

  it('adds active class if the link as currently active', () => {
    render(
      <ActiveLink href='/' active='active'>
        <a>TestHome</a>
      </ActiveLink>
    )

    expect(screen.getByRole('link', { name: 'TestHome' })).toHaveClass('active')
  })
})
