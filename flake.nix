{
  description = "Knuts Theme für seine neue Webseite";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils = {
      url = "github:numtide/flake-utils";
    };

    icons = {
      url = "github:tabler/tabler-icons/v3.1.0";
      flake = false;
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
    icons,
    server,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in rec {
        packages = rec {
          default = pkgs.stdenv.mkDerivation {
            name = "fscs-website-theme";
            src = self;

            buildInputs = with pkgs; [
              hugo
            ];

            buildPhase = ''
              mkdir -p assets # p flag to not fail if the directory exists
              ln -s ${icons}/icons assets/icons
            '';

            installPhase = ''
              cp -r . $out
            '';
          };
        
          demoSite = pkgs.stdenv.mkDerivation {
            name = "demoSite";

            src = ./demo;

            buildInputs = with pkgs; [
              hugo
              pagefind
            ];

            buildPhase = ''
              mkdir themes
              ln -s ${default} themes/knut

              hugo -e nix -d site
              hugo -e nix-hidden -d site_hidden
              hugo -e nix-private -d site_auth
              
              pagefind --site site
              pagefind --site site_hidden
              pagefind --site site_auth
            '';

            installPhase = ''
                mkdir $out
                cp -r site $out/static
                cp -r site_hidden $out/static_hidden
                cp -r site_auth $out/static_auth
            '';
          };

          runDemoSite = pkgs.writeScriptBin "run.sh" ''
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
              ${server.defaultPackage.${system}}/bin/fscs-website-backend \
                  --host 0.0.0.0 \
                  --port 8080 \
                  --database-url $DATABASE_URL \
                  --content-dir ${demoSite}/static \
                  --private-content-dir ${default}/static_auth \
                  --hidden-content-dir ${default}/static_hidden

              echo Stopping the Database
              ${pkgs.postgresql}/bin/pg_ctl -D "$DATA_DIR" stop
          '';
        };

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
