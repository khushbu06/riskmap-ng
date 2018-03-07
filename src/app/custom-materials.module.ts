import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatDialogModule,
  MatDialog,
  MatDialogRef,
  MatRadioModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';


@NgModule({
  imports: [
  ],
  exports: [
    NoopAnimationsModule,
    FormsModule,
    CdkTableModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    MatToolbarModule
  ],
  providers: [
    MatDialog,
    // MatDialogRef
  ]
})
export class CustomMaterialsModule { }