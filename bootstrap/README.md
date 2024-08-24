## Why do we bundle this weird \_rfs.scss file?

Because go sucks and hugos modules are written in the most lazy way possible.
go modules exclude all directories called `vendor`. hugo modules are just
go modules with a different coat of paint. and this file normally lives in the bootstrap source
tree under `scss/vendor/_rfs.scss`. see the problem?

Note: This file isnt needed for building with nix, because we completely ignore the module system in
that case

## How do I update this?

Just copy paste the file from the target bootstrap version, its under `scss/vendor/_rfs.scss`
