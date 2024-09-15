# Importing gcc original image
FROM gcc:latest

# Install Additional Dependencies
RUN apt-get update && apt-get install -y curl

# Working Directory
WORKDIR /usr/src/app

# Copy the server Code
COPY ./ ./

# 8000 port exposing
EXPOSE 8000

# Node Dependencies if needed
RUN apt-get install -y nodejs npm
RUN npm install 

# start server
CMD ["node", "start"]