merkur
======

build
-----
```
# install dependencies
[yarn|npm install]
# build
[yarn|npm run] install
```

development
-----------
```
[yarn|npm run] watch
docker run -it --rm --name merkur -e FILESTORE\_URL=$filestore\_url -v $(pwd)/package.json:/home/node/package.json:Z -v $(pwd)/yarn.lock:/home/node/yarn.lock:Z -v $(pwd)/src:/home/node/src:Z -v $(pwd)/node\_modules:/home/node/node\_modules:Z -p 3000:3000 merkur
```
