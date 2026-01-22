FROM node:20-alpine
RUN apk add --no-network --no-cache libc6-compat
RUN npm install -g pnpm


RUN pnpm install --frozen-lockfile

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY src ./src
COPY .env .env
COPY . .


RUN pnpm prisma generate
RUN pnpm build

ENV NODE_ENV=production
ENV PORT=4100
EXPOSE 4100

CMD ["pnpm", "start"]