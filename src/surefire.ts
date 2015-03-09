/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/firebase/firebase.d.ts" />
/// <reference path="./surefire.d.ts" />

var surefireModule = angular.module('surefire', []);

interface ISurefire {
  set(obj: any): ng.IPromise<any>;
  update(obj: any): ng.IPromise<any>;
  remove(): ng.IPromise<any>;
  once(): ng.IPromise<FirebaseDataSnapshot>;
}

interface errorCallback {
  (error: any): ng.IDeferred<any>;
}

interface IDeferredActionOptions {
  ref: Firebase;
  obj?: any;
  name: string;
}

interface ISurefireFactory {
  deferredCheck(deferred: ng.IDeferred<any>, error: any, success: any);
  deferredAction(options: IDeferredActionOptions): ng.IPromise<any>;
}

surefireModule.factory('surefireFactory', ($q: ng.IQService) => {

  // evaluate a callback for $q.defer()
  var deferredCheck = (deferred: ng.IDeferred<any>, error: any, success: any) => {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(success);
    }
  };

  // Depending on the Firebase method, return the error or value from the promise
  var deferredAction = (options: IDeferredActionOptions): ng.IPromise<any> => {
    var deferred = $q.defer();

    switch (options.name) {
      case "set":
        options.ref.set(options.obj, (error: any) => {
          deferredCheck(deferred, error, true);
        });
        break;

      case "update":
        options.ref.update(options.obj, (error: any) => {
          deferredCheck(deferred, error, true);
        });
        break;

      case "remove":
        options.ref.remove((error: any) => {
          deferredCheck(deferred, error, true);
        });
        break;

      case "once":
        options.ref.once('value', (value: any) => {
          deferredCheck(deferred, null, value);
        }, (error: any) => {
          deferredCheck(deferred, error, null);
        });
        break;

      default:
        deferred.reject(new Error('Invalid method name: Only set, update, remove, and once are allowed.'));
        break;
    }

    return deferred.promise;
  };

  var surefireFactory: ISurefireFactory = {
    deferredCheck: deferredCheck,
    deferredAction: deferredAction
  };

});

surefireModule.factory('surefire', (surefireFactory: ISurefireFactory) => {
   return (mainRef: Firebase): ISurefire => {

     // return the public API
     var publicAPI: ISurefire = {
       set: (obj: any) => {
         return surefireFactory.deferredAction({
           ref: mainRef,
           name: 'set',
           obj: obj
         });
       },
       update: (obj) => {
         return surefireFactory.deferredAction({
           ref: mainRef,
           name: 'update',
           obj: obj
         });
       },
       remove: () => {
         return surefireFactory.deferredAction({
           ref: mainRef,
           name: 'remove'
         });
       },
       once: () => {
         return surefireFactory.deferredAction({
           ref: mainRef,
           name: 'once'
         });
       }
     };

     return publicAPI;

   };
});
