# Stage one
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

# Stage two
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci -omit=dev
RUN apk add --no-cache postgresql-client

COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/db ./db
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/server.js ./server.js

USER node
EXPOSE 4000
CMD [ "node", "server.js" ]