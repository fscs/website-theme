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
    server,
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
            cp -r public $out/bin/static
            cp -r ${server.defaultPackage.${system}}/bin/migrations $out/bin/migrations
            cp ${server.defaultPackage.${system}}/bin/fscs-website-backend $out/bin/fscs-website-backend
          '';
        };

        packages.runDemoSite = pkgs.writeScriptBin "run.sh" ''
          #!/usr/bin/env bash
          DATA_DIR="$PWD/db/data"
          SOCKET_DIR="$PWD/db/sockets"
          SOCKET_URL="$(echo $SOCKET_DIR | sed 's/\//%2f/g')"
          export DATABASE_URL="postgresql://$SOCKET_URL:5432/postgres"

          mkdir -p "$DATA_DIR" "$SOCKET_DIR"

          echo Initializing the Database
          ${pkgs.postgresql}/bin/initdb -D "$DATA_DIR" --locale=C.utf8

          echo Starting the Database
          ${pkgs.postgresql}/bin/pg_ctl -D $DATA_DIR -o "-k $SOCKET_DIR -h \"\"" start

          echo Starting the server
          ${self.packages.${system}.demoSite}/bin/fscs-website-backend --database-url $DATABASE_URL --use-executable-dir

          echo Stopping the Database
          ${pkgs.postgresql}/bin/pg_ctl -D "$DATA_DIR" stop
        '';

        defaultApp = flake-utils.lib.mkApp {
          drv = self.packages.${system}.runDemoSite;
          exePath = "/bin/run.sh";
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
