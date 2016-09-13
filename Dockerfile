FROM nginx:mainline-alpine

COPY entrypoint.sh /entrypoint.sh
COPY build /www
COPY nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.processed.conf"]
