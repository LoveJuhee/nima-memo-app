import {Component, provide} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages';
import {AppStorage, UserStorage} from './providers';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class App {

  private rootPage: any;

  constructor(private platform: Platform) {
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

let providers: any[] = [
  provide('AppStorage', { useClass: AppStorage }),
  provide('UserStorage', { useClass: UserStorage }),
];
ionicBootstrap(App, providers);
