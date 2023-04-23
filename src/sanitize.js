'use strict';

class Sanitizer {

    static getString(data) {

        if(typeof data !== 'string') {
            data = JSON.stringify(data, null, 4);
        }

        return data;
    }
}

export default Sanitizer;