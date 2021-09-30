import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  usuario: any = null;
  mensagens: any = null;
  auth: any;

  constructor(private fb: FirebaseService, private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth = this.authservice.authState;

    if (this.talogado()) {
      this.getuserdados();
      this.pegarmensagens();
    }

  }


  pegarmensagens() {
    this.fb.firestoregetcolec("Chat").subscribe(doc => {
      this.mensagens = doc
    })
  }

  enviarmensagem() {

    let mensagem = {
      user: this.usuario.nomeusuario,
      mensagem: (<HTMLSelectElement>document.getElementById("mensagem")).value
    }
    //let data = new Date().getTime()

    this.fb.firestoresetdata("Chat", String(new Date().getTime()), mensagem).then(() => {
      (<HTMLSelectElement>document.getElementById("mensagem")).value = ''

    })
  }

  teste() {
    console.log(this.usuario);
    console.log(this.mensagens);

  }

  getuserdados() {
    if (this.auth.email == undefined) {
      this.fb.firestoregetdata("Usuarios", String(this.auth.user.email)).subscribe(doc => (this.usuario = doc.payload.data()));
    } else {
      this.fb.firestoregetdata("Usuarios", this.auth.email).subscribe(doc => (this.usuario = doc.payload.data()));
    }
  }

  talogado() {
    if (!this.authservice.isUserEmailLoggedIn) {
      this.router.navigate(['/login'])
      return false
    } else {
      return true
    }
  }

}
