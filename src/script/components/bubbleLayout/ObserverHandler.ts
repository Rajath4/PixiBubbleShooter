

export type ObserverFunction<T> = (data: T) => void;

export class ObserverHandler {
    protected observers: ObserverFunction<any>[] = [];

    addObserver(observer: ObserverFunction<any>): void {
        this.observers.push(observer);
    }

    removeObserver(observer: ObserverFunction<any>): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(data: any): void {
        for (const observer of this.observers) {
            observer(data);
        }
    }

    subscribe(observer: ObserverFunction<any>): () => void {
        this.addObserver(observer);
        return () => this.removeObserver(observer);
    }
}
