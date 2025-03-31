export def build [] {
}

export def start [] {
  docker run --rm -p 8080:80 -v $"($env.PWD):/usr/share/nginx/html:ro" nginx:alpine
}