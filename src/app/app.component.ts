import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserService } from './admin/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Mindtechpy';

  constructor(private oauthService: OAuthService,private userService: UserService) { }

  ngOnInit(): void {
    this._recuperaSucursal()
  }

  _recuperaSucursal() {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        //const token = this.oauthService.getAccessToken();
        const claims = this.oauthService.getIdentityClaims() as any;
        const idsucursal = claims['idsucursal'];
        //console.log('ID Sucursal:', idsucursal);
        this.userService.setIdSucursal(idsucursal);
      }
    });
  }


}
