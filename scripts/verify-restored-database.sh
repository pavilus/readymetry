#!/bin/bash

set -euo pipefail

: "${RESTORE_DATABASE_URL:?RESTORE_DATABASE_URL must reference a disposable restored database}"
: "${RESTORE_CONFIRM_DISPOSABLE:?Set RESTORE_CONFIRM_DISPOSABLE=true after verifying the target}"

if [ "$RESTORE_CONFIRM_DISPOSABLE" != "true" ]; then
  echo "Refusing verification without RESTORE_CONFIRM_DISPOSABLE=true" >&2
  exit 1
fi
if [ -n "${PRODUCTION_PROJECT_REF:-}" ] && [[ "$RESTORE_DATABASE_URL" == *"$PRODUCTION_PROJECT_REF"* ]]; then
  echo "Refusing to run against the production project reference" >&2
  exit 1
fi
command -v psql >/dev/null || { echo "Missing required command: psql" >&2; exit 1; }

script_dir="$(cd "$(dirname "$0")" && pwd)"
psql "$RESTORE_DATABASE_URL" --no-psqlrc --set ON_ERROR_STOP=1 --file "$script_dir/verify-restored-database.sql"
