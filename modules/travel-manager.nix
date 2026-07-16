{ self, siap }:
{ config, lib, pkgs, ... }:
with lib;
let
  cfg = config.hochreiner.services.travel-manager;
  travel-manager-package = self.packages.${pkgs.system}.default;
in {
  imports = [
    ./couchdb.nix
    siap.nixosModules.default
  ];

  options.hochreiner.services.travel-manager = {
    enable = mkEnableOption "travel-manager PWA";

    domain = mkOption {
      type = types.str;
      description = lib.mdDoc "nginx server_name and siap host map key";
    };

    certificateFile = mkOption {
      type = types.path;
      description = lib.mdDoc "Path to TLS certificate (PEM)";
    };

    certificateKeyFile = mkOption {
      type = types.path;
      description = lib.mdDoc "Path to TLS private key (PEM)";
    };

    ipMapping = mkOption {
      type = types.attrsOf (types.submodule {
        options = {
          user  = mkOption { type = types.str; };
          roles = mkOption { type = types.listOf types.str; default = []; };
        };
      });
      default = {};
      description = lib.mdDoc "IP address → user/roles mapping forwarded to siap";
    };
  };

  config = mkIf cfg.enable {
    hochreiner.services.couchdb = {
      enable = true;
      databases."travel_manager" = {
        memberRoles = mkDefault (
          unique (flatten (mapAttrsToList (_: u: u.roles) cfg.ipMapping))
        );
        adminRoles = mkDefault [];
      };
    };

    hochreiner.services.static-ip-authentication-proxy = {
      enable = true;
      configuration.hosts.${cfg.domain} = {
        ip_mapping = mapAttrs (_: u: { inherit (u) user roles; }) cfg.ipMapping;
        user_header  = "X-Auth-CouchDB-Username";
        roles_header = "X-Auth-CouchDB-Roles";
        token_header = "X-Auth-CouchDB-Token";
        secret_file  = "/var/lib/hochreiner-couchdb/proxy-secret";
      };
    };

    services.nginx = {
      enable = true;
      virtualHosts.${cfg.domain} = {
        forceSSL = true;
        sslCertificate    = cfg.certificateFile;
        sslCertificateKey = cfg.certificateKeyFile;

        extraConfig = ''
          client_max_body_size 10m;
          large_client_header_buffers 10 80k;
          client_header_buffer_size 10k;
          proxy_headers_hash_max_size 1024;

          location = /auth {
            internal;
            proxy_pass http://127.0.0.1:${toString config.hochreiner.services.static-ip-authentication-proxy.port}/auth;
            proxy_pass_request_body off;
            proxy_set_header Content-Length  "";
            proxy_set_header X-Original-Host $host;
            proxy_set_header X-Real-IP       $remote_addr;
          }
        '';

        locations."/" = {
          root = "${travel-manager-package}/var/html";
          tryFiles = "$uri $uri/ /index.html";
          extraConfig = ''
            expires -1;
            add_header Cache-Control "no-store, no-cache, must-revalidate";
          '';
        };

        locations."= /sw.js".extraConfig = ''
          root ${travel-manager-package}/var/html;
          add_header Cache-Control "no-store";
        '';

        locations."/data" = {
          root = "${travel-manager-package}/var/html";
          tryFiles = "$uri $uri/";
          extraConfig = ''
            expires -1;
            add_header Cache-Control "no-store, no-cache, must-revalidate";
          '';
        };

        locations."/api/_session" = {
          extraConfig = ''
            auth_request /auth;
            auth_request_set $db_user  $upstream_http_x_auth_couchdb_username;
            auth_request_set $db_roles $upstream_http_x_auth_couchdb_roles;
            auth_request_set $db_token $upstream_http_x_auth_couchdb_token;
            proxy_pass       http://127.0.0.1:5984/_session;
            proxy_set_header X-Auth-CouchDB-Username $db_user;
            proxy_set_header X-Auth-CouchDB-Roles    $db_roles;
            proxy_set_header X-Auth-CouchDB-Token    $db_token;
            proxy_redirect   off;
            proxy_buffering  off;
          '';
        };

        locations."/api" = {
          extraConfig = ''
            auth_request /auth;
            auth_request_set $db_user  $upstream_http_x_auth_couchdb_username;
            auth_request_set $db_roles $upstream_http_x_auth_couchdb_roles;
            auth_request_set $db_token $upstream_http_x_auth_couchdb_token;
            proxy_pass       http://127.0.0.1:5984/travel_manager;
            proxy_set_header X-Auth-CouchDB-Username $db_user;
            proxy_set_header X-Auth-CouchDB-Roles    $db_roles;
            proxy_set_header X-Auth-CouchDB-Token    $db_token;
            proxy_redirect   off;
            proxy_buffering  off;
          '';
        };
      };
    };
  };
}
