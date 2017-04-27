import { Injectable } from "@angular/core";
import { Observable } from "rxjs/rx"
import { Todo } from "../todo/todo"

@Injectable()
export class TodoLocalStorageService {
    storageKey: string = "todos";

    fetch() : Observable<Todo[]> {
        return Observable.of(this.fetchRaw());
    }

    private fetchRaw(): Todo[] {
        let todos: any = localStorage.getItem('todos');
        let items: Todo[] = todos ? JSON.parse(todos) : [];

        return items;
    }

    add(title: string, tags: string[]): Observable<boolean> {
        let data: Todo = {
            name: title,
            tags: tags,
            done: false,
        };

        let todos: Todo[] = this.fetchRaw();
        todos.unshift(data);

        return Observable.of(this.saveTodos(todos));
    }

    saveAll(todos: Todo[]): Observable<boolean> {
        let saved: boolean = this.saveTodos(todos);

        return Observable.of(saved);
    }

    private saveTodos(todos: Todo[]): boolean {
        if ( ! todos || todos.length <= 0) {
            return false;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(todos));
        return true;
    }
}
