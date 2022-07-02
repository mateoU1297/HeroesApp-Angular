import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  login(): void {

    this.authService.login()
      .subscribe( (resp: Auth) => {
        console.log(resp);
      }
    );

    // this.router.navigate(['./heroes']);
  }
}
