FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
COPY ./build /usr/share/nginx/html
