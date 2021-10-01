import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  usuario: any = null;
  mensagens: any = null;
  auth: any;

  constructor(private fb: FirebaseService, private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth = this.authservice.estado_Auth;

    if (this.talogado()) {
      try {
        this.getDadosUsuarios();
        this.getMensagens();
        setTimeout(() => {
          var objDiv = (<HTMLSelectElement>document.getElementById("chat"));
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 500);
      } catch (error) {
        alert(error)
        console.log(error);
      }
    }
  }

  ngOnDestroy(): void {
    try {
      this.getMensagens().unsubscribe()
    } catch (error) {
      alert(error)
      console.log(error);
    }
  }

  getMensagens() {
    return this.fb.firestoregetcolec("Chat").subscribe(doc => {
      this.mensagens = doc;
      var objDiv = (<HTMLSelectElement>document.getElementById("chat"));
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  }

  enviarmensagem() {
    let mensagem = {
      user: this.usuario.nomeusuario,
      mensagem: (<HTMLSelectElement>document.getElementById("mensagem")).value
    }
    try {
      this.fb.firestoresetdata("Chat", String(new Date().getTime()), mensagem).then(() => {
        (<HTMLSelectElement>document.getElementById("mensagem")).value = ''
      }).catch(error => {
        alert(error)
      })
    } catch (error) {
      alert(error)
      console.log(error);
    }

  }

  getDadosUsuarios() {
    if (this.auth.email == undefined) {
      return this.fb.firestoregetdata("UsuariosChat", String(this.auth.user.email)).subscribe(doc => (this.usuario = doc.payload.data()));
    } else {
      return this.fb.firestoregetdata("UsuariosChat", this.auth.email).subscribe(doc => (this.usuario = doc.payload.data()));
    }
  }

  talogado() {
    if (!this.authservice.usuario_logado_email) {
      this.router.navigate(['/login'])
      return false
    } else {
      return true
    }
  }

}