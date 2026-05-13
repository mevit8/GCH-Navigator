FROM python:3.11-slim

WORKDIR /app

COPY . .

EXPOSE 8080

CMD sh -c "python -m http.server 8080"