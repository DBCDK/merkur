/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

// doesn't inherit from Error because of a limitation in babel:
// https://github.com/babel/babel/issues/4058

class Exception {
    constructor(message) {
        this.message = message;
    }
}

class IllegalArgumentException extends Exception {
    constructor(message) {
        super(message);
        this.name = "IllegalArgumentException";
    }
}

class NullPointerException extends Exception {
    constructor(message) {
        super(message);
        this.name = "NullPointerException";
    }
}

export {Exception, IllegalArgumentException, NullPointerException};
