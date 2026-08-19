#!/bin/bash

set -euo pipefail

: "${BACKUP_OUTPUT_DIR:?BACKUP_OUTPUT_DIR must point to off-site or mounted backup storage}"
: "${BACKUP_AGE_RECIPIENT:?BACKUP_AGE_RECIPIENT is required}"
: "${SUPABASE_PROJECT_REF:?SUPABASE_PROJECT_REF is required for the manifest}"

for command_name in supabase age tar git shasum; do
  command -v "$command_name" >/dev/null || { echo "Missing required command: $command_name" >&2; exit 1; }
done

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$BACKUP_OUTPUT_DIR"
output_dir="$(cd "$BACKUP_OUTPUT_DIR" && pwd)"
case "$output_dir/" in
  "$repo_root/"*) echo "BACKUP_OUTPUT_DIR must be outside the repository" >&2; exit 1 ;;
esac

backup_tmp="$(mktemp -d /tmp/readymetry-backup.XXXXXX)"
trap 'rm -rf "$backup_tmp"' EXIT

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive_name="readymetry-${timestamp}.tar.gz.age"
archive_path="$output_dir/$archive_name"
manifest_path="$archive_path.json"

supabase db dump --linked --file "$backup_tmp/roles.sql" --role-only
supabase db dump --linked --file "$backup_tmp/schema.sql"
supabase db dump --linked --file "$backup_tmp/data.sql" --data-only --use-copy
tar -C "$backup_tmp" -czf "$backup_tmp/readymetry.tar.gz" roles.sql schema.sql data.sql
age --recipient "$BACKUP_AGE_RECIPIENT" --output "$backup_tmp/encrypted.age" "$backup_tmp/readymetry.tar.gz"
mv "$backup_tmp/encrypted.age" "$archive_path"

checksum="$(shasum -a 256 "$archive_path" | awk '{print $1}')"
commit="$(git -C "$repo_root" rev-parse HEAD)"
printf '{"createdAt":"%s","projectRef":"%s","gitCommit":"%s","archive":"%s","sha256":"%s"}\n' \
  "$timestamp" "$SUPABASE_PROJECT_REF" "$commit" "$archive_name" "$checksum" > "$manifest_path"

echo "Encrypted backup created: $archive_path"
echo "Manifest created: $manifest_path"
