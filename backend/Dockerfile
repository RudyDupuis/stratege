FROM node:20-alpine AS build

WORKDIR /app
COPY ./backend .
COPY ../shared ./shared
RUN npm install
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/ ./

EXPOSE 3000

CMD ["npm", "run", "start"]
