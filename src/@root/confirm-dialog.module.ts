import {NgModule} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material.module';


import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    MaterialModule,
    FlexLayoutModule,
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
})
export class ConfirmDialogModule {
}
