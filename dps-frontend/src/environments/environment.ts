import { Provider } from "@angular/compiler/src/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { MockBackend } from "../app/mocks/mock_backend";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// import { MockBackend } from '../app/mocks/mock_backend';
// import { HTTP_INTERCEPTORS } from "@angular/common/http";

export const environment = {
  production: false,
  imports: [

  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockBackend,
      multi: true
    }
  ]
};
