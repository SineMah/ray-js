'use strict';

import Command from './command.js'
import PostProcessor from '../posprocessor.js';

class Time extends Command {

    async run() {
        const date = new Date();
        const content = {
            formatted: date.toISOString(),
            timestamp: Math.floor(Date.now()/1000),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        const response = await this.processCommand('carbon', content);

        return new PostProcessor(response.uuid, response.origin);
    }
}

export default Time;