{
  description = "Knuts Theme für seine neue Webseite";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        defaultPackage = pkgs.stdenv.mkDerivation {
          name = "fscs-website-theme";
          src = self;

          buildInputs = with pkgs; [
            hugo
          ];

          buildPhase = ''
            mkdir assets
            ln -s ${pkgs.fetchFromGitHub {
              owner = "tabler";
              repo = "tabler-icons";
              rev = "v2.47.0";
              hash = "sha256-7WawRKx15zbd0Gngcu+L6ztOQcKqLJvf98dg2jrKbzw=";
            }} assets/icons
          '';

          installPhase = ''
            cp -r . $out
          '';
        };

        devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            hugo
            go
            git
          ];
        };
      }
    );
}
