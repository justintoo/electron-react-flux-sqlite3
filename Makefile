start: install
	npm start

install:
	npm install
	./node_modules/.bin/electron-rebuild

clean:
	npm prune
	rm -rf bower_components
	rm -rf node_modules
	rm -rf public
	rm -rf dist
	find . -iname "\.DS_Store" -exec rm -f {} \;

package: package-all

package-local: install
	electron-packager .  --platform=darwin --arch=x64 --overwrite

package-all: install
	electron-packager .  --arch=x64 --overwrite

