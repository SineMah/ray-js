'use strict';

import Command from './command.js'
import PostProcessor from '../posprocessor.js';
import Sanitizer from '../sanitize.js';

class Dump extends Command {

    async run(data) {
        const content = {
            content: `<pre class="relative overflow-x-auto w-full p-5 h-auto bg-gray-100 dark:bg-gray-800"><code class="h-auto">${Sanitizer.getString(data)}</code></pre>`,
            label: ''
        };
        const response = await this.processCommand('custom', content);

        return new PostProcessor(response.uuid, response.origin);
    }
}

export default Dump;