
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required by mysqlclient
RUN apt-get update && apt-get install -y \
    bash \
    build-essential \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Collect Django static files during the image build
RUN python manage.py collectstatic --noinput

# Make startup script executable
RUN chmod +x /app/start.sh

EXPOSE 8000

# Start Celery and Daphne
CMD ["/bin/bash", "/app/start.sh"]
