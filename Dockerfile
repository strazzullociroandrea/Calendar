FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY src ./src
RUN pnpm install --frozen-lockfile

COPY . .


RUN pnpm prisma generate
RUN pnpm build

ENV PORT=4100
EXPOSE 4100

CMD ["pnpm", "start"]