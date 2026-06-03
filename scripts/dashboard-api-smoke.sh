#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${DASHBOARD_API_BASE_URL:-http://127.0.0.1:8788}"
FUNNEL_ID="${DASHBOARD_FUNNEL_ID:-tdi_latam_01}"
MARKET="${DASHBOARD_MARKET:-renda_extra}"

unauthenticated_routes=(
  "/api/dashboard/session"
  "/api/dashboard/funnels"
  "/api/dashboard/overview?funnel_id=${FUNNEL_ID}&market=${MARKET}"
  "/api/dashboard/leads?funnel_id=${FUNNEL_ID}&market=${MARKET}&page=1&page_size=10"
  "/api/dashboard/leads/example-lead?funnel_id=${FUNNEL_ID}"
  "/api/dashboard/health-metrics?market=${MARKET}"
)

for route in "${unauthenticated_routes[@]}"; do
  unauthenticated_status="$(
    curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}${route}"
  )"

  if [[ "${unauthenticated_status}" != "401" ]]; then
    echo "Expected unauthenticated ${route} to return 401, got ${unauthenticated_status}."
    exit 1
  fi
done

echo "PASS: all unauthenticated dashboard API routes return 401."

if [[ -z "${DASHBOARD_ACCESS_TOKEN:-}" ]]; then
  echo "SKIP: set DASHBOARD_ACCESS_TOKEN to run authenticated dashboard API smoke checks."
  exit 0
fi

authorization_header="Authorization: Bearer ${DASHBOARD_ACCESS_TOKEN}"

curl -fsS "${BASE_URL}/api/dashboard/session" \
  -H "${authorization_header}" \
  > /dev/null

curl -fsS "${BASE_URL}/api/dashboard/funnels" \
  -H "${authorization_header}" \
  > /dev/null

curl -fsS \
  "${BASE_URL}/api/dashboard/overview?funnel_id=${FUNNEL_ID}&market=${MARKET}" \
  -H "${authorization_header}" \
  > /dev/null

curl -fsS \
  "${BASE_URL}/api/dashboard/leads?funnel_id=${FUNNEL_ID}&market=${MARKET}&page=1&page_size=10" \
  -H "${authorization_header}" \
  > /dev/null

curl -fsS \
  "${BASE_URL}/api/dashboard/health-metrics?market=${MARKET}" \
  -H "${authorization_header}" \
  > /dev/null

echo "PASS: authenticated dashboard API smoke checks completed."
