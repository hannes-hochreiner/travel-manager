{
  description = "Travel App";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-25.11";
    nixpkgs-us.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    static-ip-authentication-proxy.url = "github:hannes-hochreiner/static-api-authentication-proxy";
  };

  outputs = { self, nixpkgs, nixpkgs-us, static-ip-authentication-proxy }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
    };
    pkgs-us = import nixpkgs-us {
      inherit system;
    };
    travel-manager = derivation {
      inherit system;
      name = "travel-manager-${self.shortRev or "dev"}";
      builder = "${pkgs.nushell}/bin/nu";
      buildInputs = with pkgs; [
        uutils-coreutils-noprefix
        tera-cli
      ];
      args = [ ./builder.nu "build" ./. ];
    };
  in {
    packages.${system}.default = travel-manager;

    devShells.${system}.default = pkgs.mkShell {
      name = "travel-app";
      shellHook = ''
        exec nu
      '';
      buildInputs = with pkgs; [
        pkgs-us.bun
        nushell
        tera-cli
      ];
    };

    nixosModules.default = import ./modules/travel-manager.nix {
      inherit self;
      siap = static-ip-authentication-proxy;
    };

    nixosConfigurations.travel-manager-test = nixpkgs.lib.nixosSystem {
      inherit system;
      modules = [
        self.nixosModules.default
        ({ pkgs, ... }: {
          boot.isContainer = true;
          networking.hostName = "travel-manager-test";
          networking.firewall.allowedTCPPorts = [ 443 ];

          hochreiner.services.travel-manager = {
            enable = true;
            domain = "travel.test";
            certificateFile    = "/etc/ssl/test-cert.pem";
            certificateKeyFile = "/etc/ssl/test-key.pem";
            ipMapping."127.0.0.1" = {
              user  = "testuser";
              roles = [ "travel_manager_member" ];
            };
          };

          system.stateVersion = "25.11";
        })
      ];
    };
  };
}
