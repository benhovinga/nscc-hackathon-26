FROM python:3.13-slim

WORKDIR /app

# Copy frontend files
COPY . .

# Expose port for the frontend
EXPOSE 9000

# Start the HTTP server
CMD ["python", "-m", "http.server", "9000", "--bind", "0.0.0.0"]
