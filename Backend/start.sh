
#!/bin/bash

set -e

echo "Starting Celery worker..."
celery -A mains.mains worker --loglevel=info --concurrency=1 &
CELERY_PID=$!

echo "Starting Daphne server..."
daphne -b 0.0.0.0 -p "${PORT:-10000}" mains.mains.asgi:application &
DAPHNE_PID=$!

cleanup() {
    echo "Stopping Celery and Daphne..."
    kill -TERM "$CELERY_PID" "$DAPHNE_PID" 2>/dev/null || true
    wait "$CELERY_PID" 2>/dev/null || true
    wait "$DAPHNE_PID" 2>/dev/null || true
}

trap cleanup TERM INT

# Exit if either process stops
set +e
wait -n "$CELERY_PID" "$DAPHNE_PID"
STATUS=$?
set -e

echo "Celery or Daphne exited with status $STATUS"

cleanup
exit 1
