FROM alpine:3.22

RUN apk add --no-cache \
    nodejs \
    npm \
    python3 \
    make \
    g++ \
    gcc \
    libc6-compat \
    openssl

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
