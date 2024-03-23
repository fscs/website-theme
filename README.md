# knut

Knuts Theme für seine neue Hugo Webseite!

## Developing
A demo site containing some dummy content is available under `demo/`. 

### nix

`nix run` will spin up a local server including all your changes. 

### not nix

```sh
cd demo
hugo

# the site has now been built. however search and the calendar wont work.
# for the search to work you need to run
pagefind --site public

# but calendar and the sitzung preview still wont work. you need the backend.
ln -s public static
mkdir -p db/data db/sockets
initdb -D ./db/data --locale=C.utf8

pg_ctl -D ./db/ -o "-k $PWD/db/sockets -h \"\"" start

fscs-website-backend --database-url "postgresql://$(echo $PWD/db/sockets | sed 's/\//%2f/g'):5432/postgres"

pg_ctl -D ./db/data stop
```
