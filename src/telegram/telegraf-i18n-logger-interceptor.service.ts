import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as i18nUtils from 'nestjs-i18n/dist/utils/context';


@Injectable()
export class TelegrafI18nLoggerInterceptor implements OnModuleInit {
    private readonly logger = new Logger(this.constructor.name);
    private static readonly suppressed_messages: string = 'context type: telegraf not supported';

    onModuleInit() {
        this.logger.debug(`Intercepting I18nService Logger to suppress unwanted warnings: '${TelegrafI18nLoggerInterceptor.suppressed_messages}'`);
        const lo = this.logger;

        const originalWarn = Logger.prototype.warn;
        Logger.prototype.warn = function (message: any, ...optionalParams: any[]) {
            lo.log(`Warn Intercepted: '${message}'`);
            if (typeof message === 'string' && message.startsWith(TelegrafI18nLoggerInterceptor.suppressed_messages)) {
                return; // Suppress this specific warning
            }
            originalWarn.call(this, message, ...optionalParams);
        };
    }
}

//
// @Injectable()
// export class I18nLoggerPatcher implements OnModuleInit {
//     private readonly logger = new Logger(this.constructor.name);
//     onModuleInit() {
//         const m = (i18nUtils as any);
//         const mlog = (i18nUtils as any).logger;
//         this.logger.debug(`Got ${JSON.stringify(m)}`);
//
//         if (i18nUtils && (i18nUtils as any).logger) {
//             const logger = (i18nUtils as any).logger;
//
//             // Override the warn method to suppress specific warnings
//             const originalWarn = logger.warn;
//             logger.warn = function (message: any, ...optionalParams: any[]) {
//                 if (typeof message === 'string' && message.includes('context type: telegraf not supported')) {
//                     return; // Suppress this specific warning
//                 }
//                 originalWarn.call(this, message, ...optionalParams);
//             };
//         }
//     }
// }


@Injectable()
export class I18nContextGetterPatcher implements OnModuleInit {
    private readonly logger = new Logger(this.constructor.name);

    onModuleInit() {
        this.logger.debug('Patching getContextObject to suppress warnings');

        if (i18nUtils && (i18nUtils as any).getContextObject) {
            const originalGetContextObject = (i18nUtils as any).getContextObject;

            (i18nUtils as any).getContextObject = function (...args: any[]) {

                // Check if a warning log would have been triggered
                const contextType = args[1]?.getType() ?? 'undefined';
                if (contextType === 'telegraf') {
                    return undefined; // Suppress the warning by skipping the log
                }

                return originalGetContextObject.apply(this, args);
            };
        }
    }
}