import { DynamicModule, Module, Type, OnModuleInit, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MediatorService } from './services/index.js';
import { COMMAND_HANDLER_METADATA, QUERY_HANDLER_METADATA } from './decorators/index.js';
import { ICommand, ICommandHandler, IQuery, IQueryHandler } from './interfaces/index.js';

export interface NestMediatorModuleOptions {
  handlers?: Type<ICommandHandler<any> | IQueryHandler<any, any>>[];
}

@Module({})
export class NestMediatorModule implements OnModuleInit {
  constructor(
      private readonly mediatorService: MediatorService,
      private readonly reflector: Reflector,
      @Inject('HANDLERS_CONFIG')
      private readonly handlers: Type<ICommandHandler<any> | IQueryHandler<any, any>>[]
  ) {}

  onModuleInit() {
    console.log(`[NestMediator] Registering ${this.handlers.length} handlers...`);

    this.handlers.forEach((handlerType) => {
      const commandMetadata = this.reflector.get<Type<ICommand>>(
          COMMAND_HANDLER_METADATA,
          handlerType
      );

      if (commandMetadata) {
        console.log(
            `[NestMediator] Registering command handler: ${handlerType.name} for command: ${commandMetadata.name}`
        );
        this.mediatorService.registerCommandHandler(
            commandMetadata,
            handlerType as Type<ICommandHandler<any>>
        );
      }

      const queryMetadata = this.reflector.get<Type<IQuery>>(
          QUERY_HANDLER_METADATA,
          handlerType
      );

      if (queryMetadata) {
        console.log(
            `[NestMediator] Registering query handler: ${handlerType.name} for query: ${queryMetadata.name}`
        );
        this.mediatorService.registerQueryHandler(
            queryMetadata,
            handlerType as Type<IQueryHandler<any, any>>
        );
      }
    });
  }

  /**
   * Register the NestMediator module with handlers
   * @param options - Module options containing handlers to register
   * @returns Dynamic module
   */
  static forRoot(options: NestMediatorModuleOptions = {}): DynamicModule {
    const handlers = options.handlers || [];

    return {
      module: NestMediatorModule,
      providers: [
        MediatorService,
        {
          provide: 'HANDLERS_CONFIG',
          useValue: handlers,
        },
      ],
      exports: [MediatorService],
      global: true,
    };
  }
}