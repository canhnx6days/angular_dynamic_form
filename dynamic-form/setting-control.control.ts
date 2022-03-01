import { SettingControlType } from '../../../configs/constants';
import { SettingControlModel } from './setting-control.model';

export class TextboxControl extends SettingControlModel<string> {
  override controlType = SettingControlType.Textbox;
}

export class DropdownControl extends SettingControlModel<string> {
  override controlType = SettingControlType.Dropdown;
}

export class CheckboxGroupControl extends SettingControlModel<string[]> {
  override controlType = SettingControlType.CheckboxGroup;
}

export class PasswordControl extends SettingControlModel<string> {
  override controlType = SettingControlType.Password;
}

export class CheckboxControl extends SettingControlModel<boolean> {
  override controlType = SettingControlType.Checkbox;
}
