use std/log
export-env {
    use std/log []
}

export def build [] {
}

export def start [] {
  # stop
  let network = (docker network ls --format json --filter $"name=travel-manager" | from json)

  print $network

  if $network == null {
    log info "creating network"
    docker network create --driver bridge travel-manager
  } else {
    log info "network already exists"
  }

  let couchdb = (docker ps --filter "name=travel-manager-couchdb" --format json -a | from json)

  if $couchdb == null {
    log info "creating couchdb container"
    docker run -d --network travel-manager -p 5984:5984 --name travel-manager-couchdb -v $"($env.PWD)/couchdb.ini:/opt/couchdb/etc/local.d/couchdb.ini" -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3.4.1
  } else if $couchdb.state != "running" {
    log info "starting couchdb container"
    docker start travel-manager-couchdb
  }

  sleep 5sec
  http put http://admin:password@localhost:5984/travel_manager ""

  let server = (docker ps --filter "name=travel-manager-server" --format json -a | from json)

  if $server == null {
    log info "creating server container"
    docker run -d --network travel-manager --name travel-manager-server -p 8080:80 -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($env.PWD):/usr/share/nginx/html:ro" nginx:alpine
  } else if $server.state != "running" {
    log info "starting server container"
    docker start travel-manager-server
  }
}

export def stop [] {
  remove_container "travel-manager-server"
  remove_container "travel-manager-couchdb"
  remove_network "travel-manager"
}

def remove_container [
  container: string
] {
  let server = (docker ps --filter $"name=($container)" --format json -a | from json)

  if ($server != null) {
    if $server.state == "running" {
      log info $"stopping container '($container)'"
      docker stop $container
    }

    log info $"removing container '($container)'"
    docker rm $container
  }
}

def remove_network [
  network: string
] {
  if (docker network ls --format json --filter $"name=($network)" | from json) != null {
    log info "removing network"
    docker network rm $network
  }
}

export def start_server [] {
  # docker run --rm -p 8080:80 --link travel-manager-couchdb:couchdb -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($env.PWD):/usr/share/nginx/html:ro" nginx:alpine
  docker run --rm -p 8080:80 --link travel-manager-couchdb:couchdb -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($env.PWD):/usr/share/nginx/html:ro" nginx:alpine
}

export def start_db [] {
  # docker run --rm -p 5984:5984 couchdb
  # docker run --rm --name travel-manager-couchdb -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3.4.1
  # docker run --rm -p 5984:5984 -v $"($env.PWD)/couchdb.ini:/opt/couchdb/etc/local.d/couchdb.ini:ro" -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3.4.1
  docker run --rm -p 5984:5984 --name travel-manager-couchdb -v $"($env.PWD)/couchdb.ini:/opt/couchdb/etc/local.d/couchdb.ini" -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3.4.1
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
