import { render, screen, fireEvent } from '@testing-library/react'
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripes'

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

jest.mock('../../services/stripes')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price', amount: 15 }} />)

    expect(screen.getByText('for $15.00 month')).toBeInTheDocument()
  })

  it('should return correctly getStaticProps object', async () => {
    const retrievedStripeMock = jest.mocked(stripe.prices.retrieve)

    retrievedStripeMock.mockResolvedValueOnce({
      id: '10',
      unit_amount: 5584
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: { product: { priceId: '10', amount: 55.84 } }
      })
    )
  })
})
