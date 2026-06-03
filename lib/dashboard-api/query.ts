import { ApiError } from "./http"

const DIMENSION_PATTERN = /^[A-Za-z0-9_-]+$/
const SEARCH_PATTERN = /^[^*,()]+$/
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function queryValue(url: URL, name: string) {
  const value = url.searchParams.get(name)?.trim()
  return value || null
}

export function optionalDimension(url: URL, name: string, maxLength = 128) {
  const value = queryValue(url, name)

  if (!value) {
    return null
  }

  if (value.length > maxLength || !DIMENSION_PATTERN.test(value)) {
    throw new ApiError(400, `Invalid ${name}.`, "invalid_query")
  }

  return value
}

export function requiredDimension(url: URL, name: string, maxLength = 128) {
  const value = optionalDimension(url, name, maxLength)

  if (!value) {
    throw new ApiError(400, `${name} is required.`, "invalid_query")
  }

  return value
}

export function optionalSearch(url: URL, name: string, maxLength = 128) {
  const value = queryValue(url, name)

  if (!value) {
    return null
  }

  if (value.length > maxLength || !SEARCH_PATTERN.test(value)) {
    throw new ApiError(400, `Invalid ${name}.`, "invalid_query")
  }

  return value
}

export function optionalBoolean(url: URL, name: string) {
  const value = queryValue(url, name)

  if (!value) {
    return null
  }

  if (value !== "true" && value !== "false") {
    throw new ApiError(400, `Invalid ${name}.`, "invalid_query")
  }

  return value === "true"
}

export function positiveInteger(
  url: URL,
  name: string,
  fallback: number,
  maximum: number
) {
  const value = queryValue(url, name)

  if (!value) {
    return fallback
  }

  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new ApiError(400, `Invalid ${name}.`, "invalid_query")
  }

  return parsed
}

export function optionalDate(url: URL, name: string) {
  const value = queryValue(url, name)

  if (!value) {
    return null
  }

  if (!ISO_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new ApiError(400, `Invalid ${name}.`, "invalid_query")
  }

  return value
}

export function addEqFilter(
  params: URLSearchParams,
  column: string,
  value: string | boolean | null
) {
  if (value !== null) {
    params.set(column, `eq.${String(value)}`)
  }
}

export function addIlikeFilter(
  params: URLSearchParams,
  column: string,
  value: string | null
) {
  if (value !== null) {
    params.set(column, `ilike.*${value}*`)
  }
}

export function addDateRangeFilters(
  params: URLSearchParams,
  column: string,
  from: string | null,
  to: string | null
) {
  if (from) {
    params.append(column, `gte.${from}T00:00:00.000Z`)
  }

  if (to) {
    params.append(column, `lt.${to}T00:00:00.000Z`)
  }
}
