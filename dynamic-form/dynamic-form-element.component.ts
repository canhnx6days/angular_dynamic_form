import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlService } from './dynamic-form.service';
import { SettingControlModel } from './setting-control.model';


@Component({
  selector: 'dynamic-form-element',
  templateUrl: './dynamic-form-element.component.html'
})


export class DynamicFormElementComponent {
  dynamicFormControlService = new DynamicFormControlService;
  constructor() { }
  @Input() settingControl!: SettingControlModel<any>;
  @Input() settingControls!: SettingControlModel<any>[];
  @Input() formGroup!: FormGroup;
  @Input() isSubmit!: boolean;
}
