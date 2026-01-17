FROM python:3.13-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose port for the backend API
EXPOSE 8000

# Default command (will be overridden by docker-compose)
CMD ["python", "main.py"]
