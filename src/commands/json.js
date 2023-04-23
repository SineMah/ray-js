'use strict';

import Command from './command.js'
import PostProcessor from '../posprocessor.js';
import Sanitizer from '../sanitize.js';

class Json extends Command {

    async run(data) {
        const content = {
            value: Sanitizer.getString(data)
        };
        const response = await this.processCommand('json_string', content);

        return new PostProcessor(response.uuid, response.origin);
    }
}

export default Json;