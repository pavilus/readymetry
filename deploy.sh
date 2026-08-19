#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Readymetry — Deploy to VPS
# Usage: ./deploy.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

VPS="root@2.24.101.250"
SSH_KEY="$HOME/.ssh/claude_vps"
REMOTE_PATH="/root/readymetry"
LOCAL_PATH="$(cd "$(dirname "$0")" && pwd)"

echo "▶ Syncing files to VPS..."
rsync -az --delete -e "ssh -i $SSH_KEY" \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='.env*' \
  --exclude='tsconfig.tsbuildinfo' \
  --exclude='.DS_Store' \
  --exclude='_brand' \
  "$LOCAL_PATH/" \
  "$VPS:$REMOTE_PATH/"

echo "▶ Building and restarting on VPS..."
ssh -i "$SSH_KEY" "$VPS" \
  "set -e; cd $REMOTE_PATH; test \"\$(node --version | cut -d. -f1)\" = v22; npm ci; npm run env:check; npm run build; if pm2 describe readymetry >/dev/null 2>&1; then pm2 restart readymetry; else pm2 start ecosystem.config.js; fi; pm2 save"

echo "✓ Deployed to https://readymetry.com"
