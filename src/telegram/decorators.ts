import { Context as TelegrafContext } from 'telegraf';
import {
    UseGuards,
    Injectable,
    CanActivate,
    ExecutionContext,
    applyDecorators,
    Logger, SetMetadata
} from '@nestjs/common';


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
    private readonly allowedIdsString: string ;

    constructor(private readonly allowedIds: Set<number>,
                private readonly functionName: string | undefined = undefined
    ) {
        this.allowedIdsString = JSON.stringify([...allowedIds]);
        this.logger.debug(`TelegrafIdGuard initialized for function "${this.functionName}" with allowed IDs: ${this.allowedIdsString}`);
    }

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
            // const functionName = executionContext.getHandler().name;
            const calledFrom = `id=${userId}, first_name=${telegrafContext?.from?.first_name}, last_name=${telegrafContext?.from?.last_name}, username=${telegrafContext?.from?.username}`
            this.logger.debug(`Function "${this.functionName}" was called from a non-allowed ID ${calledFrom}. Allowed ids are ${this.allowedIdsString}`);
        }
        return canActivate;
    }
}


export function RestrictToTelegramIds(allowedIds: Iterable<number>) {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
        const functionName = key.toString();

        return applyDecorators(
            SetMetadata('functionName', functionName),
            UseGuards(new TelegrafIdGuard(new Set<number>(allowedIds), functionName))
        )(target, key, descriptor);
    };
}