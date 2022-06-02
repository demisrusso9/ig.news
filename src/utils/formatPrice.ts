export function formatPrice(price: number) {
  return price.toLocaleString('en-Us', {
    currency: 'USD',
    style: 'currency'
  })
}

// export function formatPriceIntl(price: number) {
//   new Intl.NumberFormat('en-Us', {
//     currency: 'USD',
//     style: 'currency'
//   }).format(price)
// }
