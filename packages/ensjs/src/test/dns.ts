import type { RequestListener } from 'http'
import type { MockedFunction } from 'vitest'

type Handler = MockedFunction<RequestListener>

export const createHandlerResponse = (handler: Handler, response: object) => {
  handler.mockImplementation((_req, res) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    res.writeHead(200, { 'Content-Type': 'application/dns-json' })
    res.end(JSON.stringify(response))
    res.destroy()
  })
}
