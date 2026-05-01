#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies"
npm ci

echo "Building app"
npm run build