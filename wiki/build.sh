#!/usr/bin/env bash
set -e

WIKI="$(pwd)"
echo "WIKI: $WIKI"
BUILD="$WIKI/build"
BUILD_WIKI="$WIKI/build/wiki"

# $1 - The version name of the book, e.g. v0.1.6-core
# $2 - The hash of the book to build
build_book() {
	cd "$WIKI/tmp"
	git checkout -f "$2"
	cd ..

	echo "-- Adding newest book.toml file..."
	cp "$WIKI/book.toml" "$WIKI/tmp/wiki/book.toml"

	echo "-- Adding the Flint theme..."
	mkdir -p "$WIKI/tmp/wiki/theme"
	cp "$WIKI/theme/flint.css" "$WIKI/tmp/wiki/theme"
	cp "$WIKI/theme/flint-highlight.css" "$WIKI/tmp/wiki/theme"

	echo "-- Adding the Version Selector..."
	cp "$WIKI/version_select.css" "$WIKI/tmp/wiki"
	cp "$WIKI/version_select.html" "$WIKI/tmp/wiki"
	cp "$WIKI/version_select.js" "$WIKI/tmp/wiki"

	rm -rf "$BUILD_WIKI/$1"
	mkdir -p "$BUILD_WIKI/$1"
	echo "-- Building the book for the '$1' version..."
	echo "-- Source dir: $WIKI/tmp/wiki"
	echo "-- Output dir: $BUILD_WIKI/$1"
	mdbook build -d "$BUILD_WIKI/$1" "$WIKI/tmp/wiki"

	echo "-- Adding the Flint syntax highlighter..."
	cat "$WIKI/flint_highlight.js" >> "$BUILD_WIKI/$1/highlight.js"
}

build_latest() {
	rm -rf "$BUILD_WIKI/latest"
	mkdir -p "$BUILD_WIKI/latest"
	mdbook build -d "$BUILD_WIKI/latest" "$WIKI"

	echo "-- Adding the Flint syntax highlighter..."
	cat "$WIKI/flint_highlight.js" >> "$BUILD_WIKI/latest/highlight.js"

	echo "-- Adding the Flint theme..."
	mkdir -p "$BUILD_WIKI/latest/theme"
	cp "$WIKI/theme/flint.css" "$BUILD_WIKI/latest/theme"
	cp "$WIKI/theme/flint-highlight.css" "$BUILD_WIKI/latest/theme"

	echo "-- Adding the Version Selector..."
	cp "$WIKI/version_select.css" "$BUILD_WIKI/latest"
	cp "$WIKI/version_select.html" "$BUILD_WIKI/latest"
	cp "$WIKI/version_select.js" "$BUILD_WIKI/latest"
}

# Ensure that the tmp directory exists and that we have cloned the wiki into it
if ! [ -d "$WIKI/tmp" ]; then
	git clone "https://github.com/flint-lang/flint-lang.github.io.git" "$WIKI/tmp"
fi

# First ensure that we are at the latest version
cd "$WIKI/tmp"
git checkout -f main
git clean -fd
git reset
git fetch
git pull
cd ..

# Copy the index.html into the build directory
mkdir -p "$BUILD_WIKI"
cp "$WIKI/index.html" "$BUILD_WIKI/index.html"
cp "$WIKI/../index.html" "$BUILD/index.html"

while IFS=',' read -r -a fields
do
	echo
	echo "Name: ${fields[0]}, Hash: ${fields[1]}"
	build_book "${fields[0]}" "${fields[1]}"
done < <(grep -v "^$" versions.csv | tail -n +2)

rm -rf "$BUILD_WIKI/latest"
echo "$1"
if [ "$1" = "--debug" ]; then
	build_latest
fi

cp "$WIKI/version_select.html" "$BUILD_WIKI"

echo "-- Hosting locally via darkhttpd..."
cd "$BUILD"
darkhttpd ./
cd ..

