import Logger from 'js-logger';

const logger = {
    create(level) {
        Logger.useDefaults();
        Logger.setLevel(Logger[level ? level.toUpperCase() : 'INFO']);
        return Logger;
    }
}

export default logger;