/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

// a class to handle binding path params to values
class Path {
	constructor(path) {
		this.path = path;
	}
	bind(key, value) {
		this.path = this.path.replace(`:${key}`, value);
		return this;
	}
}

export default Path;
