'use strict';

import Config from './config.js';
import PostProcessor from './posprocessor.js';
import Notify from './commands/notify.js';
import Log from './commands/log.js';
import Json from './commands/json.js';
import Time from './commands/time.js';
import Custom from './commands/custom.js';
import Dump from './commands/dump.js';

class Ray {
    static config(args = {}) {
        Config.init(args);
    }

    static async log (text) {
        const log = new Log();
        const response = await log.run(text);

        return PostProcessor.run(response.uuid, response.origin);
    }

    static async json (data) {
        const json = new Json();
        const response = await json.run(data);

        return PostProcessor.run(response.uuid, response.origin);
    }

    static async time () {
        const time = new Time();
        const response = await time.run();

        return PostProcessor.run(response.uuid, response.origin);
    }

    static async notify (text) {
        const notify = new Notify();
        const response = await notify.run(text);

        return PostProcessor.run(response.uuid, response.origin);
    }

    static async custom (data, label) {
        const custom = new Custom();
        const response = await custom.run(data, label);

        return PostProcessor.run(response.uuid, response.origin);
    }

    static async dump (data) {
        const dump = new Dump();
        const response = await dump.run(data);

        return PostProcessor.run(response.uuid, response.origin);
    }
}

export default Ray;