# Updating Bootstrap

## Checklist
- [ ] update the bootstrap input in `flake.nix`
- [ ] update the bootstrap version in `go.mod`
- [ ] ensure the required popper js version is still v2
    - if it no longer is, you might have to find a new way to fetch it. i was lazy and just stole the [hugo mod version](https://github.com/gohugoio/hugo-mod-jslibs-dist/tree/main/popperjs)
    - [ ] update in flake
    - [ ] update in go.mod
- [ ] update the `bootstrap/_rfs.scss` file
- [ ] does the site still work? (use the demo)
