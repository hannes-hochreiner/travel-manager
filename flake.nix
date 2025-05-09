{
  description = "Travel App";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-24.11";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
    };
    travel-manager = derivation {
      inherit system;
      name = "travel-manager-v0.0.1";
      builder = "${pkgs.nushell}/bin/nu";
      buildInputs = with pkgs; [
        # gcc_multi
        # rust-bin-custom
        uutils-coreutils-noprefix
      ];
      args = [ ./builder.nu "build" ./. ];
    };
  in {
    packages.${system}.default = travel-manager;

    devShells.${system}.default = pkgs.mkShell {
      name = "travel-app";
      
      # Inherit inputs from checks.
      # checks = self.checks.${system};
      shellHook = ''
        exec zellij -l zellij.kdl
      '';
      # Additional dev-shell environment variables can be set directly
      # MY_CUSTOM_DEVELOPMENT_VAR = "something else";
      # Extra inputs can be added here; cargo and rustc are provided by default.
      buildInputs = with pkgs; [
        zellij
        nodejs_23
        nushell
        tera-cli
      ];
    };

  };
}
