import { Context as TelegrafContext } from 'telegraf';
import {
    SetMetadata,
    UseGuards,
    Injectable,
    CanActivate,
    ExecutionContext,
    applyDecorators,
    Logger
} from '@nestjs/common';
import {TelegrafI18nContext} from "nestjs-telegraf-i18n";


export function CatchErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Error in ${propertyKey}: ${error.message}`, error.stack);
            } else {
                console.error(`Error in ${propertyKey}:`, error);
            }
        }
    };

    return descriptor;
}


@Injectable()
export class TelegrafIdGuard implements CanActivate {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly allowedIds: Set<number>) {}

    canActivate(executionContext: ExecutionContext): boolean {
        const contextType = executionContext?.getType<string>() ?? undefined;
        const args = executionContext.getArgs();
        let telegrafContext: TelegrafContext;
        let earlyBreak: boolean = false;
        if (!contextType || contextType !== 'telegraf' || args.length === 0) {
            earlyBreak = true;
        } else {
            telegrafContext = executionContext.getArgs()[0];
        }
        if (earlyBreak || !(telegrafContext instanceof TelegrafContext)) {
            this.logger.warn(`Telegraf Guard used on non-telegraf context: contextType=${contextType}, detectedType=${telegrafContext?.constructor?.name}`);
            return false;
        }

        const userId = telegrafContext?.from?.id;
        const canActivate =  userId ? this.allowedIds.has(userId) : false;
        if (!canActivate) {
            this.logger.log(`A function was called from a non allowed id ${userId}`);
        }
        return canActivate;
    }
}

export function RestrictToTelegramIds(allowedIds: Iterable<number>) {
    return applyDecorators(
        UseGuards(new TelegrafIdGuard(new Set<number>(allowedIds)))
    );
}