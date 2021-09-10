import Logger from 'js-logger';
import {ILogLevel} from 'js-logger/src/types';

const logger = {
    create(level: string = "INFO") {
        Logger.useDefaults();
        Logger.setLevel({
            name: level
        } as ILogLevel);
        return Logger;
    }
}

export default logger;