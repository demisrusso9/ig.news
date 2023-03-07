import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'

// This factory function allows smooth preview setup
export function createClient(config: any = {}) {
  const client: prismic.Client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    ...config,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req
  })

  return client
}
