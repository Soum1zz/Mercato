FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Leave empty so Axios makes relative requests (/api/...) that Nginx can reverse proxy
ARG VITE_API_BASE_URL=""
ARG VITE_RAZORPAY_KEY=rzp_test_TZVhVTq2uiCxTc

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RAZORPAY_KEY=$VITE_RAZORPAY_KEY

RUN npm run build


FROM nginx:alpine

# Copy Nginx configuration with reverse proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]