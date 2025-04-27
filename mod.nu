export def build [] {
}

export def start [] {
  stop
  docker network create --driver bridge travel-manager
  docker run -d --network travel-manager -p 5984:5984 --name travel-manager-couchdb -v $"($env.PWD)/couchdb.ini:/opt/couchdb/etc/local.d/couchdb.ini" -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3.4.1
  sleep 5sec
  http put http://admin:password@localhost:5984/travel_manager ""
  docker run -d --network travel-manager --name travel-manager-server -p 8080:80 -v $"($env.PWD)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" -v $"($env.PWD):/usr/share/nginx/html:ro" nginx:alpine
}

export def stop [] {
  remove_container "travel-manager-server"
  remove_container "travel-manager-couchdb"
  remove_network "travel-manager"
}

def remove_container [
  container: string
] {
  let server = (docker ps --filter $"name=($container)" --format json | from json)

  if ($server != null) {
    if $server.state == "running" {
      docker stop $container
    }

    docker rm $container
  }
}

def remove_network [
  network: string
] {
  if (docker network ls --format json --filter $"name=($network)" | from json) != null {
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
