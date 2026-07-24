import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error desconocido';

      switch (error.status) {
        case 0:
          message = 'No se pudo conectar con el servidor';
          break;
        case 400:
          message = error.error?.message || 'Solicitud incorrecta';
          break;
        case 404:
          message = 'Recurso no encontrado';
          break;
        case 409:
          message = error.error?.message || 'Conflicto: el recurso ya existe o está en uso';
          break;
        case 500:
          message = 'Error interno del servidor';
          break;
        default:
          message = `Error ${error.status}: ${error.message}`;
      }

      snackBar.open(message, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-error']
      });

      return throwError(() => error);
    })
  );
};
