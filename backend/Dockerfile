FROM node:20-slim AS build

RUN apt-get update && apt-get install -y \
    libc6 \
    libgcc-s1 \
    libstdc++6 \
    libgfortran5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY ./backend .
COPY ../shared ./shared
RUN npm install
RUN npm run build

FROM node:20-slim

WORKDIR /app
COPY --from=build /app/ ./

EXPOSE 3000

CMD ["npm", "run", "start"]
