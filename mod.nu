export def build [] {
}

export def start [] {
  docker run --rm -p 8080:80 -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($env.PWD):/usr/share/nginx/html:ro" nginx:alpine
}

export def nix-build [] {
  nix build
}

export def nix-log [] {
  nix log
}
