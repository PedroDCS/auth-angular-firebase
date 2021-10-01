import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  estado_Auth: any = null;

  constructor(private fireauth: AngularFireAuth, private router: Router) {
    this.fireauth.authState.subscribe((auth => {
      this.estado_Auth = auth;
    }))
  }


  get usuario_anonimo_logado(): boolean {
    return (this.estado_Auth !== null) ? this.estado_Auth.isAnonymous : false
  }

  get usuario_logado_email(): boolean {
    if ((this.estado_Auth !== null) && (!this.usuario_anonimo_logado)) {
      return true
    } else {
      return false
    }
  }

  registrar_com_email(data: any) {
    return this.fireauth.createUserWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        this.estado_Auth = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  getAuth() {
    return this.fireauth;
  }

  resetar_senha(emailAddress: string) {
    return this.fireauth.sendPasswordResetEmail(emailAddress).then(function () {
    }).catch(error => {
      console.log(error)
      throw error
    });
  }

  login_com_email(data: any) {
    return this.fireauth.signInWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        this.estado_Auth = user
      })
      .catch(error => {
        console.log(error)
        throw error
      });
  }

  singout(): void {
    this.fireauth.signOut().then(() => {
      setTimeout(() => {
        this.router.navigate(['/login'])
      }, 1000);
    });
  }

}
