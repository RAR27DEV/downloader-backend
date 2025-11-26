FROM python:3.11-slim

RUN apt-get update && apt-get install -y ffmpeg curl && apt-get clean

RUN pip install yt-dlp

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 8080

CMD ["npm", "start"]
