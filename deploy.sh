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
rsync -az -e "ssh -i $SSH_KEY" \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='.env.local' \
  --exclude='.env' \
  --exclude='tsconfig.tsbuildinfo' \
  --exclude='.DS_Store' \
  --exclude='_brand' \
  "$LOCAL_PATH/" \
  "$VPS:$REMOTE_PATH/"

echo "▶ Building and restarting on VPS..."
ssh -i "$SSH_KEY" "$VPS" \
  "cd $REMOTE_PATH && npm install --production=false && npm run build && pm2 restart readymetry || pm2 start ecosystem.config.js"

echo "✓ Deployed to https://readymetry.com"
