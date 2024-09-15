# Imporing java Image
FROM openjdk:latest

# Install Additional Dependencies
RUN apt-get update && apt-get install -y curl

# Working Directory
WORKDIR /usr/src/app

# Copy the server code
COPY ./ ./

# Expose port 
EXPOSE 8080

# Node Dependencies if needed
RUN apt-get install -y nodejs npm
RUN npm install 

# start server
CMD ["node", "server.js"];