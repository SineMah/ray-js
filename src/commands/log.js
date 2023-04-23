'use strict';

import Command from './command.js'
import PostProcessor from '../posprocessor.js';
import Sanitizer from '../sanitize.js';

class Log extends Command {

    async run(text) {
        const content = {
            values: [text]
        };
        const response = await this.processCommand('log', Sanitizer.getString(content));

        return new PostProcessor(response.uuid, response.origin);
    }
}

export default Log;