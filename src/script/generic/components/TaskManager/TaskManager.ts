import { Task } from "./Task";

export class TaskManager {
    private tasks: Task[] = [];

    // Add a task to the queue
    add(task: Task): void {
        this.tasks.push(task);
    }

    // Execute all tasks sequentially
    async start(): Promise<void> {
        for (const task of this.tasks) {
            await task.execute();
        }
        console.log("All tasks completed.");
    }
}
