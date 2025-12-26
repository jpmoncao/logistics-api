import { DomainEvent } from "../events/domain-event";

export abstract class EntityEvent {
    private _domainEvents: DomainEvent[] = [];

    get domainEvents(): DomainEvent[] {
        return this._domainEvents;
    }

    protected addEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }

    public clearEvents(): void {
        this._domainEvents = [];
    }
}