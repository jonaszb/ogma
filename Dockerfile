# Build stage for frontend (ui)
FROM node:16 AS ui-build-stage
WORKDIR /app/ui
COPY ui/package*.json ./
RUN npm install
COPY ui/ .
RUN npm run build

# Base image for the combined app
FROM python:3.8

# Setting up essentials and nginx
RUN apt-get update && apt-get install -y nginx supervisor && apt-get clean

# Remove default nginx configurations
RUN rm /etc/nginx/sites-enabled/default

# Set up backend (api)
WORKDIR /app/api
COPY api/requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY api/ .

# Copy built frontend from the build stage to nginx directory
COPY --from=ui-build-stage /app/ui/dist /usr/share/nginx/html
COPY ui/nginx_mono.conf /etc/nginx/conf.d/default.conf

# Setting up supervisord to manage processes
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 80 5001

CMD ["/usr/bin/supervisord"]
