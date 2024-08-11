// Define an abstract Task class with an abstract execute method
export abstract class Task {
    // Each task must implement this method
    abstract execute(): Promise<void>;
}
