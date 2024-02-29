{
  description = "Knuts Theme für seine neue Webseite";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils = {
      url = "github:numtide/flake-utils";
    };

    server = {
      type = "git";
      url = "ssh://git@github.com/fscs/website-server.git";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    server
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
            mkdir -p assets # p flag to not fail if the directory exists
            ln -s ${tabler-icons}/icons assets/icons
          '';

          installPhase = ''
            cp -r . $out
          '';
        };

        packages.demoSite = pkgs.stdenv.mkDerivation {
          name = "demoSite";

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
            mkdir -p $out/bin
            mkdir -p $out/bin/templates
            cp -r public $out/bin/static
            cp ${server.defaultPackage.${system}}/bin/backend $out/bin/backend
          '';
        };

        defaultApp = flake-utils.lib.mkApp {
          drv = self.packages.${system}.demoSite;
          exePath = "/bin/backend";
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
