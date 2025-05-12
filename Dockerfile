# Etap 1: Budowanie aplikacji
FROM node:18-alpine AS build
# Autor aplikacji
LABEL author="Kacper Klusek"
# Ustawienie katalogu roboczego
WORKDIR /app
# Skopiowanie plików package.json i package-lock.json
COPY package*.json ./
# Instalacja zależności
RUN npm install
# Skopiowanie reszty aplikacji
COPY . .

# Etap 2: Uruchomienie aplikacji
FROM node:18-alpine
# Dodanie curl aby healthcheck dzialal
RUN apk add --no-cache curl
# Ustawienie katalogu roboczego
WORKDIR /app
# Skopiowanie tylko wymaganych plików z etapu budowania
COPY --from=build /app /app
# Eksponowanie portu na którym nasłuchuje aplikacja
EXPOSE 3000
# Uruchomienie aplikacji, logowanie daty uruchomienia, autora i portu
CMD echo "Aplikacja uruchomiona przez: Kacper Klusek" && \
    echo "Data uruchomienia: $(date)" && \
    echo "Port TCP: 3000" && \
    npm start
# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl --silent --fail http://localhost:3000 || exit 1

