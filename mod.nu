use std/log
export-env {
    use std/log []
}

export def build [] {
}

export def start [] {
  docker compose up -d
}

export def stop [] {
  docker compose down
}

export def init_db [] {
  http put http://admin:password@localhost:5984/travel_manager ""
}

export def nix-build [] {
  nix build
}

export def nix-log [] {
  nix log
}
