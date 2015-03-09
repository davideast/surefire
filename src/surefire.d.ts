/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/firebase/firebase.d.ts" />

declare module Surefire {
  export interface ISurefire {
    set(obj: any): ng.IPromise<any>;
    update(obj: any): ng.IPromise<any>;
    remove(): ng.IPromise<any>;
    once(): ng.IPromise<FirebaseDataSnapshot>;
  }
}
