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
  in {

    # packages.${system}.hello = nixpkgs.legacyPackages.x86_64-linux.hello;

    # packages.${system}.default = self.packages.x86_64-linux.hello;

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
      ];
    };

  };
}
