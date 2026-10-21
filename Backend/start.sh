#!/bin/sh

set -e

celery -A mains.mains worker --loglevel=info &
CELERY_PID=$!

daphne -b 0.0.0.0 -p "${PORT:-8000}" mains.mains.asgi:application &
DAPHNE_PID=$!

cleanup() {
    kill "$CELERY_PID" "$DAPHNE_PID" 2>/dev/null || true
}

trap cleanup TERM INT

# Stop the container if either process exits.
while true; do
    if ! kill -0 "$CELERY_PID" 2>/dev/null; then
        echo "Celery worker stopped unexpectedly."
        cleanup
        wait
        exit 1
    fi

    if ! kill -0 "$DAPHNE_PID" 2>/dev/null; then
        echo "Daphne stopped unexpectedly."
        cleanup
        wait
        exit 1
    fi

    sleep 5
done