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

    # theme dependencies
    icons = {
      url = "github:tabler/tabler-icons/v3.1.0";
      flake = false;
    };

    bootstrap = {
      url = "github:twbs/bootstrap/v5.3.3";
      flake = false;
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    server,
    icons,
    bootstrap,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in rec {
        packages.default = pkgs.stdenv.mkDerivation {
          name = "fscs-website-theme";
          src = self;

          buildInputs = with pkgs; [
            hugo
          ];

          buildPhase = ''
            mkdir -p assets/js/ assets/scss/
            ln -s ${icons}/icons assets/icons
            ln -s ${bootstrap}/js assets/js/bootstrap
            ln -s ${bootstrap}/scss assets/scss/bootstrap
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
            ln -s ${packages.default} themes/knut

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
          ${packages.demoSite}/bin/fscs-website-backend --database-url $DATABASE_URL --use-executable-dir

          echo Stopping the Database
          ${pkgs.postgresql}/bin/pg_ctl -D "$DATA_DIR" stop
        '';

        apps.default = flake-utils.lib.mkApp {
          drv = packages.runDemoSite;
          exePath = "/bin/run.sh";
        };

        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            hugo
            go
            git
            pagefind
            simple-http-server
          ];
        };
      }
    );
}
