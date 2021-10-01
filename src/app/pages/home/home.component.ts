import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseService } from 'src/app/shared/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: any = null;
  auth: any;

  constructor(private fb: FirebaseService, private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth = this.authservice.estado_Auth;
    if (this.talogado()) {
      try {
        this.getDadosUsuarios()
      } catch (error) {
        alert("error")
        console.log(error);
      }
    }
  }

  salvardados() {
    let data = this.usuario
    data.nomeusuario = (<HTMLSelectElement>document.getElementById("nomedeusuario")).value
    try {
      this.fb.firestoreupdatedata("UsuariosChat", this.usuario.email, data).then(() => {
        alert("Dados Salvos com Sucesso!")
        this.router.navigate(['/chat'])
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