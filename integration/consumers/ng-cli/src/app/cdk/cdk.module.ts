import { VERSION } from '@angular/cdk';
import { ObserversModule } from '@angular/cdk/observers';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, InjectionToken, NgModule, Version } from '@angular/core';

const CDK_VERSION_TOKEN = new InjectionToken<Version>('VERSION_TOKEN');

@Component({
  selector: 'app-some-cdk-component',
  template: `
    <div cdkObserveContent></div>
    <cdk-table></cdk-table>
  `,
})
export class SomeCdkComponent {}

@NgModule({
  imports: [CommonModule, ObserversModule, CdkTableModule],
  declarations: [SomeCdkComponent],
  exports: [ObserversModule, SomeCdkComponent],
  providers: [
    {
      provide: CDK_VERSION_TOKEN,
      useValue: VERSION,
    },
  ],
})
export class CdkModule {}
