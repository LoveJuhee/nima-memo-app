'use strict';

import {Component, provide, Type, ViewChild}            from '@angular/core';
import {ionicBootstrap, MenuController, Nav, Platform}  from 'ionic-angular';
import {StatusBar}                                      from 'ionic-native';
import {LoginPage, MemoListPage} from './pages';
import {AppStorage, UserStorage} from './providers';
import {Auth} from './providers';

@Component({
  templateUrl: 'build/app.html',
  providers: [Auth, AppStorage],
})
export class App {

  @ViewChild(Nav) private nav: Nav;

  private rootPage: Type;
  private pages: Array<{ title: string, component: Type }>;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private auth: Auth
  ) {
    this.rootPage = LoginPage;
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Memo', component: MemoListPage },
    ];
  }

  private initializeApp(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  public openPage(page: any): void {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  };

  public logout(): void {
    this.auth.setCurrentUser()
      .then(() => {
        this.openPage({ component: LoginPage });
      });
  }
}

let providers: any[] = [
  provide('AppStorage', { useClass: AppStorage }),
  provide('UserStorage', { useClass: UserStorage }),
];
ionicBootstrap(App, providers);
