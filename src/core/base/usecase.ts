import { DomainEventDispatcher } from "../../core/events/dispatcher"
import { DomainEvent } from "../events/domain-event";

export abstract class BaseUseCase<IRequest, IResponse> {
    constructor(protected dispatcher?: DomainEventDispatcher) { }

    abstract execute(request?: IRequest): Promise<IResponse> | IResponse;

    protected async dispatchEvents(events: DomainEvent[]): Promise<boolean> {
        if (!this.dispatcher)
            throw new Error('Use case não possui um dispatcher declarado.');

        for (const event of events) {
            try {
                await this.dispatcher.dispatch(event);
            } catch (error) {
                console.error(`O evento: ${event.eventName} falhou ao ser disparado!`);
            }
        }

        return true;
    }
}