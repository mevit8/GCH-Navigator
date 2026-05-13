FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD sh -c "sed -i \"s/PORT_PLACEHOLDER/$PORT/g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"