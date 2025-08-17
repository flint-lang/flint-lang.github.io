#!/usr/bin/env bash
set -e

WIKI="$(pwd)"
echo "WIKI: $WIKI"

# $1 - The version name of the book, e.g. v0.1.6-core
# $2 - The hash of the book to build
build_book() {
	if ! [ -d "tmp" ]; then
		git clone "https://github.com/flint-lang/flint-lang.github.io.git" "$WIKI/tmp"
	fi
	cd "$WIKI/tmp"
	git checkout -f "$2"
	cd ..

	echo "-- Adding newest book.toml file..."
	cp "$WIKI/book.toml" "$WIKI/tmp/wiki/book.toml"

	echo "-- Adding the Flint syntax highlighter..."
	cat "flint_highlight.js" >> "$WIKI/tmp/wiki/highlight.js"

	echo "-- Adding the Flint theme..."
	mkdir -p "$WIKI/tmp/wiki/theme"
	cp "$WIKI/theme/flint.css" "$WIKI/tmp/wiki/theme"
	cp "$WIKI/theme/flint-highlight.css" "$WIKI/tmp/wiki/theme"

	echo "-- Adding the Version Selector..."
	cp "$WIKI/version_select.css" "$WIKI/tmp/wiki"
	cp "$WIKI/version_select.html" "$WIKI/tmp/wiki"
	cp "$WIKI/version_select.js" "$WIKI/tmp/wiki"

	rm -rf "$WIKI/build/$1"
	mkdir -p "$WIKI/build/$1"
	echo "-- Building the book for the '$1' version..."
	echo "-- Source dir: $WIKI/tmp/wiki"
	echo "-- Output dir: $WIKI/build/$1"
	mdbook build -d "$WIKI/build/$1" "$WIKI/tmp/wiki"
}

build_latest() {
	rm -rf "$WIKI/build/latest"
	mkdir -p "$WIKI/build/latest"
	mdbook build -d "$WIKI/build/latest" "$WIKI"

	echo "-- Adding the Flint syntax highlighter..."
	cat "flint_highlight.js" >> "$WIKI/build/latest/highlight.js"

	echo "-- Adding the Flint theme..."
	mkdir -p "$WIKI/build/latest/theme"
	cp "theme/flint.css" "$WIKI/build/latest/theme"
	cp "theme/flint-highlight.css" "$WIKI/build/latest/theme"

	echo "-- Adding the Version Selector..."
	cp "$WIKI/version_select.css" "$WIKI/build/latest"
	cp "$WIKI/version_select.html" "$WIKI/build/latest"
	cp "$WIKI/version_select.js" "$WIKI/build/latest"
}

while IFS=',' read -r -a fields
do
	echo
	echo "Name: ${fields[0]}, Hash: ${fields[1]}"
	build_book "${fields[0]}" "${fields[1]}"
done < <(tail -n +2 versions.csv)

rm -rf "$WIKI/build/latest"
echo "$1"
if [ "$1" = "--debug" ]; then
	build_latest
fi

cp "$WIKI/version_select.html" "$WIKI/build"

echo "-- Hosting locally via darkhttpd..."
cd "$WIKI/build"
darkhttpd ./
cd ..

