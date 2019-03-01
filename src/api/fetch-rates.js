import { INTERVAL, API_URL } from 'app-constants'
import fetch from 'utils/fetch-with-timeout'

const merger = (acc, [input, rates]) => {
  Object.entries(rates).forEach(([output, rate]) => {
    if (input === output) return
    acc[`${input}:${output}`] = rate
  })
  return acc
}

const fetchRates = async (currencies = [], timeout = INTERVAL / 2) => {
  if (currencies.length < 2) throw new Error('[400]: less than 2 currencies')

  const list = currencies.join(',')
  const res = await fetch(`${API_URL}&fsyms=${list}&tsyms=${list}`, { timeout })

  if (!res) throw new Error('[600]: empty response')
  if (!res.ok) throw new Error(`[${res.status}]: ${await res.text()}`)

  const rates = Object.entries(await res.json())

  if (rates.length !== currencies.length) throw new Error('[600]: length error')

  return rates.reduce(merger, {})
}

export default fetchRates
