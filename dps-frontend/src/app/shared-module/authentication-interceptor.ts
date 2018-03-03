import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../core-module/auth.service';

@Injectable()
export class AuthenitcationInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isAuthorized()) {
            request = request.clone({
                setHeaders: {
                    authentication: this.authService.authToken
                }
            });
        }

        return next.handle(request);
    }
}