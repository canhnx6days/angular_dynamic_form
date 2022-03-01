import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegexFormat } from '../../../../configs/constants';
import { DynamicFormControlService } from '../../dynamic-form/dynamic-form.service';
import { DropdownControl, TextboxControl } from '../../dynamic-form/setting-control.control';
import { SettingControlModel } from '../../dynamic-form/setting-control.model';
import { UserModel as ItemModel } from '../../models';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  item = new ItemModel();

  isCreateItem = false;
  visibleCreateOrUpdateItem: boolean;

  isSubmit = false;
  formGroup: FormGroup;

  dynamicFormControlService = new DynamicFormControlService;
  settingControls: SettingControlModel<any>[];
  hasValidateScroll = false;
  allClass = [];

  constructor() { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initSettingControls() {
    const settingControls: SettingControlModel<any>[] = [
      new TextboxControl({
        key: 'name',
        label: 'name',
        value: this.item.name,
        validates: {
          maxLength: 50,
          pattern: RegexFormat.Name,
          required: true,
        },
      }),

      new DropdownControl({
        key: 'class',
        label: 'class',
        options: this.allClass,
        optionLabel: 'name',
        optionValue: 'rights',
        hidden: !this.isCreateItem,
        onChange: this.onChangeClass.bind(this),
      }),
    ];
    return settingControls;
  }

  onChangeClass() {

  }

  initFormGroup() {
    this.settingControls = this.initSettingControls();
    this.formGroup = this.dynamicFormControlService.toFormGroup(this.settingControls);
  }

  showDialogCreateOrEditItem(isCreate = false, rowData = null) {
    this.isSubmit = false;
    this.isCreateItem = isCreate;
    if (isCreate) {
      this.item = new ItemModel();
    } else {
      this.item = { ...rowData };
    }
    this.initFormGroup();
    this.visibleCreateOrUpdateItem = true;
  }

  onSubmitCreateOrEditItem() {
    this.isSubmit = true;
    this.hasValidateScroll = false;
    setTimeout(() => {
      this.dynamicFormControlService
        .validateScroll(this.settingControls, this.hasValidateScroll);
    });
    if (!this.dynamicFormControlService
      .checkValidate(this.formGroup, this.settingControls)) {
      return;
    }
    this.getInputValue();
    if (this.isCreateItem) {
      this.createItem();
    } else {
      this.updateItem();
    }
  }

  createItem() {

  }

  updateItem() {

  }

  getInputValue() {
    this.dynamicFormControlService
      .getInputValue(this.settingControls, this.formGroup, this.item);
  }
}
