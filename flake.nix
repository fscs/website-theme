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

        packages.buildTestSite = pkgs.stdenv.mkDerivation {
          name = "buildTestSite";

          src = self.defaultPackage.${system};

          buildInputs = with pkgs; [
            hugo
            pagefind
          ];

          buildPhase = ''
            hugo -Detesting-no-modules
            pagefind --site public
          '';

          installPhase = ''
            cp -r public $out
          '';
        };

        packages.serveTestSite = pkgs.writeScriptBin "serve" ''
          ${pkgs.simple-http-server}/bin/simple-http-server -ip 1313 ${self.packages.${system}.buildTestSite}
        '';

        defaultApp = flake-utils.lib.mkApp {
          drv = self.packages.${system}.serveTestSite;
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
