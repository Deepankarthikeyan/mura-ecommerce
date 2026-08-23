#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
npx wrangler pages deploy . --project-name murai-website --branch main "$@"
