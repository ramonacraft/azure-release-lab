#!/usr/bin/env bash
# Write .vercel/project.json from Azure secret env vars.
set -euo pipefail

trim() {
  printf '%s' "$1" | tr -d '[:space:]'
}

VERCEL_TOKEN="$(trim "${VERCEL_TOKEN:-}")"
VERCEL_ORG_ID="$(trim "${VERCEL_ORG_ID:-}")"
VERCEL_PROJECT_ID="$(trim "${VERCEL_PROJECT_ID:-}")"

if [ -z "$VERCEL_TOKEN" ] || [ -z "$VERCEL_ORG_ID" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
  echo "##vso[task.logissue type=error]Missing Vercel secrets. Set VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID as pipeline variables (secret)."
  echo "token set: $([ -n "$VERCEL_TOKEN" ] && echo yes || echo no)"
  echo "org id set: $([ -n "$VERCEL_ORG_ID" ] && echo yes || echo no)"
  echo "project id set: $([ -n "$VERCEL_PROJECT_ID" ] && echo yes || echo no)"
  exit 1
fi

mkdir -p .vercel
printf '{"orgId":"%s","projectId":"%s","projectName":"azure-release-lab"}\n' \
  "$VERCEL_ORG_ID" "$VERCEL_PROJECT_ID" > .vercel/project.json

echo "Vercel project link file is in place (ids not printed)."
echo "token set: yes"
echo "org id set: yes"
echo "project id set: yes"
