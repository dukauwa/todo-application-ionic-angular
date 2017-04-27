import { Component } from '@angular/core';
import { Todo, TodoService } from '../../app/services/todo/todo';
import { ToastController, AlertController, Loading, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loader: Loading;
  todos: Todo[];

  constructor(
    private todoService: TodoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.initLoader();
    this.loadTodos();
  }

  showInputAlert() {
    let prompt = this.alertCtrl.create({
      title: 'Add New Item',
      message: "Add a new item to the todo list.",
      inputs: [{ name: 'title', placeholder: 'e.g Buy groceries' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Add',
          handler: data => {
            this.todoService.add(data.title, []).subscribe(
              response => {
                let todo: Todo = {
                  name: data.title,
                  done: false,
                  tags: []
                };
                this.todos.unshift(todo)
              }
            );
          }
        }
      ]
    });
    prompt.present();
  }

  updateItemState(evt:any, todo: Todo) {
    if (evt) {
      let index: number = this.todos.indexOf(todo);

      if (~index) {
        if (todo.done == true) {
          todo = this.todos[index]
          this.todos.splice(index, 1);
          this.todos.push(todo)
        }
        this.todoService.saveAll(this.todos).subscribe(
          done => {
            this.presentToast(
              "Item marked as " + (todo.done ? "completed" : "not completed")
            )
          }
        );
      }
    }
  }

  private presentToast(message: string) {
    this.toastCtrl.create({message: message, duration: 2000}).present();
  }

  private initLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Loading items..."
    });
  }

  private loadTodos() {
    this.loader.present().then(() => {
      this.todoService.fetch().subscribe(
        data => {
          this.todos = data;
          this.loader.dismiss();
        }
      );
    })
  }
}
