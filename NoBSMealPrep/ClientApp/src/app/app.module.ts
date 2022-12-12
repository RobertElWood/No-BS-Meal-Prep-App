import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeViewComponent } from './components/recipe-view/recipe-view.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { Secret } from './secret';
import { FavoritesViewComponent } from './components/favorites-view/favorites-view.component';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';
import { GroceryListComponent } from './components/grocery-list/grocery-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RecipeListComponent,
    RecipeViewComponent,
    FavoritesViewComponent,
    FavoritesListComponent,
    GroceryListComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'recipe-list', component: RecipeListComponent},
      { path: 'recipe-view/:id', component: RecipeViewComponent},
      { path: 'favorites-view/:id', component: FavoritesViewComponent},
      { path: 'favorites-list', component: FavoritesListComponent},
      { path: 'grocery-list', component: GroceryListComponent },
      { path: 'calendar', component: CalendarComponent },
    ])
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              Secret.client_id
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }

  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
