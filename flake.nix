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

        tabler-icons = pkgs.fetchFromGitHub {
          owner = "tabler";
          repo = "tabler-icons";
          rev = "v2.47.0";
          hash = "sha256-7WawRKx15zbd0Gngcu+L6ztOQcKqLJvf98dg2jrKbzw=";
        };
      in {
        defaultPackage = pkgs.stdenv.mkDerivation {
          name = "fscs-website-theme";
          src = self;

          buildInputs = with pkgs; [
            hugo
          ];

          buildPhase = ''
            mkdir -p assets # p flag to no fail if the directory exists
            ln -s ${tabler-icons}/icons assets/icons
          '';

          installPhase = ''
            cp -r . $out
          '';
        };

        packages.buildDemoSite = pkgs.stdenv.mkDerivation {
          name = "buildDemoSite";

          src = ./demo;

          buildInputs = with pkgs; [
            hugo
            go
            git
            pagefind
          ];

          buildPhase = ''
            mkdir themes
            ln -s ${self.defaultPackage.${system}} themes/knut

            hugo -e nix
            pagefind --site public
          '';

          installPhase = ''
            cp -r public $out
          '';
        };

        packages.serve = pkgs.writeScriptBin "serve" ''
          ${pkgs.simple-http-server}/bin/simple-http-server -ip 1313 ${self.packages.${system}.buildDemoSite}
        '';

        defaultApp = flake-utils.lib.mkApp {
          drv = self.packages.${system}.serve;
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
