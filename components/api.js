/**
 * api.js  ─  Centralised API calls to the Flask backend
 * Base URL: http://localhost:5000  (proxied via Vite in dev)
 */

import axios from 'axios'

const BASE = 'http://localhost:5000'

export const api = {
  /** Server health check */
  health: () => axios.get(`${BASE}/api/health`),

  /** Hourly historical data  @param days number of past days */
  historical: (days = 7) => axios.get(`${BASE}/api/historical?days=${days}`),

  /** ML forecast  @param days number of future days */
  forecast: (days = 7) => axios.get(`${BASE}/api/forecast?days=${days}`),

  /** Model metrics + feature importance */
  metrics: () => axios.get(`${BASE}/api/metrics`),

  /** Daily aggregated summary  @param days lookback window */
  dailySummary: (days = 30) => axios.get(`${BASE}/api/daily-summary?days=${days}`),

  /** Average energy by hour-of-day */
  hourlyPattern: () => axios.get(`${BASE}/api/hourly-pattern`),
}
