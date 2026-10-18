FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY ca.pem /app/ca.pem

# Install system dependencies required by mysqlclient
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

EXPOSE 8000

# Start Django using Daphne (supports ASGI and Channels)
CMD ["sh", "-c", "daphne -b 0.0.0.0 -p ${PORT:-8000} mains.mains.asgi:application"]