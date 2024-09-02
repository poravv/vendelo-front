import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role: string | null = null;
  constructor(private oauthService: OAuthService,private authService: AuthService) { }

  logout() {
    this.oauthService.logOut();
  }

 
  ngOnInit(): void {
    this.role = this.authService.getUserRoles(); 
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isSales(): boolean {
    return this.role === 'stock';
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.role!);
  }
  
}
