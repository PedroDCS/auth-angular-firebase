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
    this.auth = this.authservice.authState;

    if (this.talogado()) {
      this.getuserdados();
    }

  }

  salvardados() {
    let data = this.usuario
    data.nomeusuario = (<HTMLSelectElement>document.getElementById("nomedeusuario")).value
    console.log(data);

    this.fb.firestoreupdatedata("Usuarios", this.usuario.email, data).then(() => {
      alert("Dados Salvos com Sucesso!")
      this.router.navigate(['/chat'])
    })
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