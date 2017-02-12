import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './shared/login.component';
import { StaffComponent } from './staff/staff.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'admin', component: AdminComponent }
];

export const routing = RouterModule.forRoot(routes);