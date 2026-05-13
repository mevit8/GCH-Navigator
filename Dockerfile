# =====================================================
# Decision Support Navigator — static site Docker image
# Serves the bundled single-file build via nginx.
# Build:  docker build -t gch-navigator .
# Run:    docker run --rm -p 8080:80 gch-navigator
# Open:   http://localhost:8080
# =====================================================
FROM nginx:1.27-alpine

# Drop the default nginx welcome page.
RUN rm -rf /usr/share/nginx/html/*

# Copy the bundled, self-contained HTML as the index page.
# This is the single file that includes all CSS, JS, fonts and images inline.
COPY ["Decision Support Navigator.html", "/usr/share/nginx/html/index.html"]

# (Optional) Also ship the modular source tree so you can switch to it
# by pointing the server root at /usr/share/nginx/html/src instead — handy
# for cache-friendly multi-file deploys.
COPY index.src.html /usr/share/nginx/html/src/index.html
COPY styles/        /usr/share/nginx/html/src/styles/
COPY scripts/       /usr/share/nginx/html/src/scripts/
COPY assets/        /usr/share/nginx/html/src/assets/

# Custom nginx config: gzip, sensible caching, SPA-safe defaults.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Sanity check the config at image-build time.
RUN nginx -t

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
