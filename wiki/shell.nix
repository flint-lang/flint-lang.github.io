{ pkgs ? import (builtins.fetchTarball {
  # Pin nixpkgs to the 25.05 release tarball from GitHub.
  # If your channel uses a different ref name, replace "nixos-25.05" below.
  url = "https://github.com/NixOS/nixpkgs/archive/nixos-25.05.tar.gz";
}) {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.mdbook
    pkgs.mdbook-toc
    # Katex breaks things any quote with a `$` in it, like `$"{expr}"` or `.$N` for example
    # pkgs.mdbook-katex
    pkgs.darkhttpd
  ];
}
