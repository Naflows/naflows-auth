#!/bin/bash
set -euo pipefail

# This script runs the tests for the auth.naflows.com service.


# Runs tests with a label so we know what failed
run_test_suite() {
  local label="$1"
  local cmd="$2"
  echo "Running $label tests..."
  if ! eval "$cmd"; then
    echo "❌ $label tests failed."
    exit 1
  fi
  echo "✅ $label tests passed."
}

# Restart services
restart_services() {
  docker compose down -v
  docker compose up -d --build
  sleep 10  # Wait for services to start
  echo "Services restarted successfully."
}

# Main
restart_services
run_test_suite "SCV" "npm run test-scv"

restart_services
run_test_suite "SSV" "npm run test-ssv"

docker compose down -v
echo "🎉 All tests passed successfully!"
