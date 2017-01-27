install:
	npm install

clean:
	npm prune
	rm -rf bower_components
	rm -rf node_modules
	rm -rf public
	rm -rf dist
	find . -iname "\.DS_Store" -exec rm -f {} \;

commit: clean
	git add .
	git commit -a

package: package-all

package-local: install
	./node_modules/.bin/electron-rebuild
	electron-packager .  --platform=darwin --arch=x64 --overwrite

package-all: install
	./node_modules/.bin/electron-rebuild
	electron-packager .  --arch=x64 --overwrite

