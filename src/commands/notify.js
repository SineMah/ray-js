'use strict';

import Command from './command.js'
import PostProcessor from '../posprocessor.js';
import Sanitizer from '../sanitize.js';

class Notify extends Command {

    async run(text) {
        const content = {
            value: text
        };
        const response = await this.processCommand('notify', Sanitizer.getString(content));

        return new PostProcessor(response.uuid, response.origin);
    }
}

export default Notify;