# Create a todo iOS and Android app with Ionic & Angular

If you have ever wanted to build applications for Android and iOS and you have no knowledge of Java, Swift or Objective-C, well you still can. This tutorial will teach you how to build a fully functional mobile application using HTML, CSS and Javascript. We will be using the Ionic framework, which is built on the back of Angular 2, to develop a mobile application which can then be deployed to an iPhone or an Android phone.




## What we will be building

In this tutorial we will be building a todo application. It will be a simple application where you can add items to a list and then cross them off when you have completed the task. Of course, it will be basic, because the main goal of the tutorial is to teach you how to develop mobile apps using Ionic 2.

#### Pre-requisites

To follow along on this tutorial, you need to:

* Have knowledge of HTML and CSS
* Have NPM (Node Package Manager) installed on your development machine
* Know Javascript (TypeScript) and Angular 2
* Know how to read documentation, the ionic documentation has a lot of information that could be useful.



#### How it will look and work

You can see below in the screenshot how the application will look and function. This will be the final product and how it would look after being deployed on your mobile phone.

![create-todo-app-with-ionic-2-and-angular-2](https://dl.dropbox.com/s/jj4n3uy6m9qfyt0/create-todo-app-with-ionic-angular-1.gif)



## Setting up

To set up you will need a few things in place. You will need to install Ionic on your development machine so we can use the Ionic CLI.

To install Ionic run the following command on your favorite terminal:

```shell
$ npm install -g ionic cordova
```

This should install Ionic and Cordova globally on your machine.

Now that we have Ionic installed, lets create a new Ionic application using the Ionic CLI. `cd` to the directory where you want to store the source code to your application and run the command below to create a blank Ionic application:

```shell
$ ionic start yourappname blank
```

This should take a few minutes. Once it is done, we can now get to creating your Ionic application. Open your project directory in your favorite text editor. I use Sublime Text 3 with the TypeScript package installed using package control, but Microsofts Code, has built-in support for TypeScript.



### File structure

When you open the project in your editor, you should see a file structure similar to this:

![How to create a todo mobile application with ionic 2 and angular 2](https://dl.dropbox.com/s/i5iejham9via0mf/create-todo-app-with-ionic-angular-2.png)

Right now, we are going to focus on the `src` directory. That is where all the changes we will make will be done and processed from. Expanding the `src` directory we see other subdirectories, you can explore each one to see what they contain. I will talk about the important ones, at least for this tutorial.

##### app/app.component.ts

This is where the applications component is created. The application component loads all other sub-components as child components. You can also use the `constructor` of this component to do some configurations that you want the application to have. An example is already in the `constructor` for the splash screen and the status bar.

```typescript
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
```

##### app/app.html

This is basically the html file that is loaded by the application component. It is defined in the `@Component` block in the `app/app.component.ts` file. In Angular 2, components can have their very own HTML file or raw HTML code attached to them.

##### app/app.module.ts

This is where the application module is defined. The application module can also import other modules.

##### app/app.scss

Each module can also have its own specific scss file registered to it. This is the one registered to the application module but it also cascades down to all submodules. Since this is the mother of all modules, this `scss` file is a global scss.



## Creating our application

Now that we have gone through the application source, lets dig in and start creating our application. To start our Ionic application, cd to the root of the project and then run the command below:

```shell
$ ionic serve
```

This will start a local server with live reload and change detection. What this means is, the Ionic CLI tool will automatically compile our code when changes are made and then reload to show the made changes. It should also automatically launch your browser and display the welcome page.

![create-todo-app-with-ionic-2-and-angular-2](https://dl.dropbox.com/s/x3j113kjo97cm7z/create-todo-app-with-ionic-angular-3.png)

### Creating your first component

As you may have guessed, the `pages/home` is where all the code that control the home page lies. I usually like to start by designing the services required for a Component to work before creating the actual component itself, but feel free to work in whatever order you like.

#### Creating the Home component

Let us create the home component. The home component should be able to display a list of all the todos with a checklist by the side where people can check off items that have been completed and see those that have not been checked off. 

Lets update the contents of the `page/home/home.ts` file:

```typescript
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
```

So what is going on here? Well, we started by importing some classes and components that we expect to use

```typescript
import { Todo, TodoService } from '../../app/services/todo/todo';
import { ToastController, AlertController, Loading, LoadingController } from 'ionic-angular';
```

We imported the `Todo` and `TodoService`. The Todo will be an `interface` that will define how we want all our `Todo` objects to be structured. The `TodoService` will be the way our application connects to a service that will manage the todos.

We have also imported `ToastController`, `AlertController`, `Loading`, `LoadingController` which are all part of Ionic core. They can be used to display toast messages, alert boxes, and loading indicator respectively. You can read up about them in the documentation.

The `ngOnInit` loads on initialization, and it calls the `initLoader` and `loadTodos` method.

If you save the file now you will get many errors, mostly because the Todo services we imported earlier do not yet exist. Let us create them.

Create a directory in `app/services/todo` and add a `todo.ts` class. This will be some sort of index where we can import all our individual todo classes from. 

```typescript
export * from "./todo.interface"
export * from "./todo.localstorage"
export * from "./todo.service"
```

Lets start creating each file, first the `todo.interface.ts` class

```typescript
export interface Todo {
    name: string;
    done: boolean;
    tags: string[];
}
```

Next we will create the `todo.localstorage.ts` file. This file will contain an implementation for the `todo.service.ts` file. It will act like a driver.

```typescript
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/rx"
import { Todo } from "../todo/todo"

@Injectable()
export class TodoLocalStorageService {
    storageKey: string = "todos";

    fetch() : Observable<Todo[]> {
        return Observable.of(this.fetchRaw());
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

    private fetchRaw(): Todo[] {
        let todos: any = localStorage.getItem('todos');
        let items: Todo[] = todos ? JSON.parse(todos) : [];

        return items;
    }

    private saveTodos(todos: Todo[]): boolean {
        if ( ! todos || todos.length <= 0) {
            return false;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(todos));
        return true;
    }
}
```

Now lets create the `todo.service.ts` file which will just act as a proxy calling the driver (which defaults to localstorage). With this method we can have different drivers. Say for instance, we do not want to store with localstorage, we can just create a new api driver, register it in the `app/app.module.ts`  file and then swap it in the `todo.service.ts` and we would be done. 

```typescript
import { Injectable } from "@angular/core"
import { Observable } from "rxjs/rx"
import { Todo, TodoLocalStorageService } from "../todo/todo"

@Injectable()
export class TodoService {
    constructor(private driver: TodoLocalStorageService) {
    }

    fetch(): Observable<Todo[]> {
        return this.driver.fetch()
    }

    add(title: string, tags: string[]): Observable<boolean> {
        return this.driver.add(title, tags);
    }

    saveAll(todos: Todo[]): Observable<boolean> {
        return this.driver.saveAll(todos);
    }
}
```

At this point, all the dependencies the home component needs to function have been created, however, we need to register these components with the application module so the app knows they exist.

In your `app/app.module.ts` file, import the new classes, and register them in the providers section of `@NgModule` . This should be how it would look now:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// !!! Import the todo service and its driver
import { TodoService, TodoLocalStorageService } from "./services/todo/todo";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    // !!! Register them as providers
    TodoService,
    TodoLocalStorageService,

    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
```

If we look at the preview now, it should still show the initial template that it showed before when we had not even done anything. This is because we have not yet updated the HTML to display the todos.

Update the `page/home/home.html` file to contain the new HTML:

```html
<ion-header>
  <ion-navbar>
    <ion-title>TODO</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding text-center class="vertical-align-content" [hidden]="todos && todos.length > 0">
  <ion-grid>
    <ion-row>
      <ion-col class="readjust">
        No item has been added. Use the "+" button below to add a new item.
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-content>

<ion-content padding [hidden]="!todos || todos.length <= 0">
  <ion-item *ngFor="let todo of todos">
    <ion-label [ngClass]="{stricken:todo.done}">{{ todo.name }}</ion-label>
    <ion-checkbox color="dark" [(ngModel)]="todo.done" (click)="updateItemState($event, todo)"></ion-checkbox>
  </ion-item>
</ion-content>

<ion-fab right bottom>
  <button ion-fab color="primary" (click)="showInputAlert()"><ion-icon name="add"></ion-icon></button>
</ion-fab>
```

Finally we would like to add some styling to the page. Update the `page/home/home.scss` file:

```scss
page-home {
    .vertical-align-content > * {
        display: flex!important;
        align-content: center!important;
        align-items: center!important;
        .readjust {
            margin-top: -60px;
            font-size: 20px;
            font-weight: 400;
            line-height: 1.5em;
            color: #676767;
        }
    }
    .stricken {
        text-decoration: line-through;
    }
}
```

> Note: We are wrapping the style around a `page-home` selector because thats the name we gave it in the `@Component` block of `page/home/home.ts`.

Now we can see our application from the preview now that it works. We can add new items and check them off as completed. For an assignment, see if you can add a delete todo feature to the current application.

### Deploying your application to a mobile device

Now that you have created the mobile application how can you deploy it? Well that is out of the scope of this tutorial but I would however suggest you read the deploying section of the [Ionic documentation](https://ionicframework.com/docs/intro/deploying/). This would give you a better understanding on how you can deply your application to your device.



### Conclusion

We have been able to create a simple todo list application using Ionic and Angular 2. Of course, we can always add additional functionality to the application, like adding real-time updates so it is updated accross devices that are viewing it at the moment. We can also add the API functionality so it talks to an external service like Firebase. for your assignment, see if you can add a delete feature to the application.

Have any questions, feedback or suggestions, feel free to ask below in the comments section.