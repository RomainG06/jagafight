import { renderPage } from 'vike/server'

export default async function handler(req, res) {
  const urlOriginal = req.url

  if (!urlOriginal) {
    res.statusCode = 400
    res.end('URL de requête manquante')
    return
  }

  const pageContext = await renderPage({ urlOriginal })
  const { httpResponse } = pageContext

  if (!httpResponse) {
    res.statusCode = 200
    res.end()
    return
  }

  const { body, statusCode, headers } = httpResponse

  headers.forEach(([name, value]) => res.setHeader(name, value))
  res.statusCode = statusCode
  res.end(body)
}
