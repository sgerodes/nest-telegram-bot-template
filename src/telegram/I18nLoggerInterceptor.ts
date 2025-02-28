import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class I18nLoggerInterceptor implements OnModuleInit {
    private readonly logger = new Logger(this.constructor.name);
    private static readonly suppressed_messages: string = 'context type: telegraf not supported';

    onModuleInit() {
        this.logger.debug(`Intercepting I18nService Logger to suppress unwanted warnings: '${I18nLoggerInterceptor.suppressed_messages}'`);
        const lo = this.logger;

        // Override NestJS Logger globally
        const originalWarn = Logger.prototype.warn;
        Logger.prototype.warn = function (message: any, ...optionalParams: any[]) {
            lo.log(`interception Warn: '${message}'`);
            if (typeof message === 'string' && message.includes(I18nLoggerInterceptor.suppressed_messages)) {
                return; // Suppress this specific warning
            }
            originalWarn.call(this, message, ...optionalParams);
        };
    }
}