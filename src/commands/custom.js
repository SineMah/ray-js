'use strict';

import Command from './command.js'
import PostProcessor from '../posprocessor.js';

class Custom extends Command {

    async run(data, label) {
        const content = {
            content: data,
            label: label
        };
        const response = await this.processCommand('custom', content);

        return new PostProcessor(response.uuid, response.origin);
    }
}

export default Custom;