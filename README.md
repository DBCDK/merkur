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
docker run -it --rm --name merkur-dev \
	-e FILESTORE_URL=$FILESTORE_URL \
	-e APIKEYS=$APIKEYS \
	-e SESSION_SECRET=$SESSION_SECRET \
	-e BIB_DK_AUTHENTICATION_URL=$BIB_DK_AUTHENTICATION_URL \
	-e BIB_DK_CLIENT_ID=$BIB_DK_CLIENT_ID \
	-e NETPUNKT_REDIRECT_URL=$NETPUNK_REDIRECT_URL \
	-e BIB_DK_REDIRECT_URL=$BIB_DK_REDIRECT_URL \
	-v $(pwd)/package.json:/home/node/package.json:Z \
	-v $(pwd)/yarn.lock:/home/node/yarn.lock:Z \
	-v $(pwd)/src:/home/node/src:Z \
	-v $(pwd)/node_modules:/home/node/node_modules:Z \
	-p 3000:3000 merkur-dev
```
