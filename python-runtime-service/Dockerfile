# Importing python image as base
FROM python:3.9

# Install additional Dependencies
RUN apt-get update && apt-get install -y curl

# Working Directory
WORKDIR /user/src/app

# Copy the Servr code
COPY ./ ./

# Expose the port 
EXPOSE 8000

# Install Node Dependencies if Needed
RUN apt-get install -y nodejs npm
RUN npn install 

# Start Server
CMD ["node", "server.js"]