/*
 * Copyright Dansk Bibliotekscenter a/s. Licensed under GPLv3
 * See license text in LICENSE.txt or at https://opensource.dbc.dk/licenses/gpl-3.0/
 */

import moment from 'moment-timezone';
import {createLogger, format, transports} from 'winston';

const TIMEZONE = process.env.TIMEZONE
    || "Europe/Copenhagen";

const timestampWithTimeZone = format((info, opts) => {
  info.timestamp = moment().tz(TIMEZONE).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  return info;
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        timestampWithTimeZone(),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({})
    ],
    exceptionHandlers: [
        new transports.Console({})
    ],
    exitOnError: false
});

export default logger;