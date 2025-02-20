import { Context as TelegrafContext } from 'telegraf';
import {
  UseGuards,
  Injectable,
  CanActivate,
  ExecutionContext,
  applyDecorators,
  Logger,
  SetMetadata,
} from '@nestjs/common';

export function CatchErrors(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      if (this.logger) {
        this.logger.error(
          `Error in ${propertyKey}: ${error.message}`,
          error.stack,
        );
      } else {
        console.error(`Error in ${propertyKey}:`, error);
      }
    }
  };

  return descriptor;
}

function getTelegrafContextFromExecutionContext(executionContext: ExecutionContext): TelegrafContext | null {
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
    return null;
  }
  return telegrafContext
}

@Injectable()
export class TelegrafIdGuard implements CanActivate {
  private readonly logger = new Logger(this.constructor.name);
  private readonly allowedIdsString: string;

  constructor(
    private readonly allowedIds: Set<number>,
    private readonly functionName: string | undefined = undefined,
  ) {
    this.allowedIdsString = JSON.stringify([...allowedIds]);
    this.logger.debug(
      `TelegrafIdGuard initialized for function "${this.functionName}" with allowed IDs: ${this.allowedIdsString}`,
    );
  }

  canActivate(executionContext: ExecutionContext): boolean {
    let telegrafContext = getTelegrafContextFromExecutionContext(executionContext);
    if (!telegrafContext) {
      this.logger.warn(`Telegraf Guard ${this.constructor.name} was used on non-telegraf context}`);
      return false;
    }

    const userId = telegrafContext?.from?.id;
    const canActivate = userId ? this.allowedIds.has(userId) : false;
    if (!canActivate) {
      // const functionName = executionContext.getHandler().name;
      const calledFrom = `id=${userId}, first_name=${telegrafContext?.from?.first_name}, last_name=${telegrafContext?.from?.last_name}, username=${telegrafContext?.from?.username}`;
      this.logger.debug(
        `Function "${this.functionName}" was called from a non-allowed ID ${calledFrom}. Allowed ids are ${this.allowedIdsString}`,
      );
    }
    return canActivate;
  }
}

export function RestrictToTelegramIds(allowedIds: Iterable<number>) {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const functionName = key.toString();

    return applyDecorators(
      SetMetadata('functionName', functionName),
      UseGuards(new TelegrafIdGuard(new Set<number>(allowedIds), functionName)),
    )(target, key, descriptor);
  };
}


/**
 * Generic guard to restrict access based on chat type.
 */
@Injectable()
class ChatTypeGuard implements CanActivate {
  private readonly logger = new Logger(ChatTypeGuard.name);
  private readonly allowedChatTypesString: string;

  constructor(private readonly allowedChatTypes: Set<string>, private readonly functionName: string) {
    this.allowedChatTypesString = JSON.stringify([...allowedChatTypes]);

    this.logger.debug(
        `ChatTypeGuard initialized for function "${this.functionName}" with allowed chat types: ${this.allowedChatTypesString}`
    );
  }

  canActivate(executionContext: ExecutionContext): boolean {
    let telegrafContext = getTelegrafContextFromExecutionContext(executionContext);
    if (!telegrafContext) {
      this.logger.warn(`ChatTypeGuard was used on a non-Telegraf context`);
      return false;
    }

    const chatType = telegrafContext.chat?.type;
    const isAllowed = this.allowedChatTypes.has(chatType);

    if (!isAllowed) {
      const calledFrom = `id=${telegrafContext?.from?.id}, first_name=${telegrafContext?.from?.first_name}, last_name=${telegrafContext?.from?.last_name}, username=${telegrafContext?.from?.username}`;
      this.logger.debug(
          `Function "${this.functionName}" was called from chat type "${chatType}" but is restricted to [${this.allowedChatTypesString}]. Caller: (${calledFrom})`
      );
    }

    return isAllowed;
  }
}

/**
 * Generic decorator factory for chat type restrictions.
 */
function RestrictToChatType(...allowedTypes: string[]) {
  return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
    const functionName = key.toString();

    return applyDecorators(
        SetMetadata('functionName', functionName),
        UseGuards(new ChatTypeGuard(new Set(allowedTypes), functionName))
    )(target, key, descriptor);
  };
}

/**
 * Decorator for private chats only.
 */
export function PrivateChatOnly() {
  return RestrictToChatType('private');
}

/**
 * Decorator for group chats only (supergroups included).
 */
export function GroupChatOnly() {
  return RestrictToChatType('group', 'supergroup');
}