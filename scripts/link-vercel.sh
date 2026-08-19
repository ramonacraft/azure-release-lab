#!/usr/bin/env bash
# Write .vercel/project.json from Azure secret env vars.
# vercel pull needs this file. It is gitignored, so CI must create it.
set -euo pipefail

if [ -z "${VERCEL_TOKEN:-}" ] || [ -z "${VERCEL_ORG_ID:-}" ] || [ -z "${VERCEL_PROJECT_ID:-}" ]; then
  echo "##vso[task.logissue type=error]Missing Vercel secrets. Set VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID as pipeline variables (secret)."
  exit 1
fi

mkdir -p .vercel
printf '{"orgId":"%s","projectId":"%s","projectName":"azure-release-lab"}\n' \
  "$VERCEL_ORG_ID" "$VERCEL_PROJECT_ID" > .vercel/project.json

echo "Vercel project link file is in place (ids not printed)."
