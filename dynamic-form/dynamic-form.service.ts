import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingControlType } from 'src/app/configs/constants';
import { SettingControlModel } from './setting-control.model';


@Injectable({
    providedIn: 'root'
})
export class DynamicFormControlService {

    constructor() { }

    toFormGroup(settingControls: SettingControlModel<any>[]) {
        const group: any = {};
        let defaultValue: any;

        settingControls.forEach(settingControl => {
            const validatorArrays = [];
            if (settingControl.validates.required) {
                validatorArrays.push(Validators.required);
            }
            const minLength = settingControl.validates.minLength;
            if (minLength) {
                validatorArrays.push(Validators.minLength(minLength));
            }
            const maxLength = settingControl.validates.maxLength;
            if (maxLength) {
                validatorArrays.push(Validators.maxLength(maxLength));
            }
            const pattern = settingControl.validates.pattern;
            if (pattern) {
                validatorArrays.push(Validators.pattern(pattern));
            }
            switch (settingControl.controlType) {
                case SettingControlType.Dropdown:
                    {
                        defaultValue = null;
                        break;
                    }
                case SettingControlType.CheckboxGroup:
                    {
                        defaultValue = [];
                        break;
                    }
                default: {
                    defaultValue = '';
                    break;
                }
            }
            group[settingControl.key] = new FormControl(settingControl.value || defaultValue, {
                validators: validatorArrays,
            });
        });
        return new FormGroup(group);
    }

    validateMessage(fromGroup: FormGroup, settingControl: SettingControlModel<any>, isSubmit: boolean) {
        const formControl = fromGroup.controls[settingControl.key];
        const messageArr: string[] = [];
        if (!isSubmit) {
            return messageArr;
        }
        if (formControl.invalid) {
            if (formControl.hasError('required')) {
                messageArr.push(`${settingControl.label}_is_required`);
                return messageArr;
            }
            if (formControl.hasError('minlength')) {
                const minlength = formControl.errors.minlength.requiredLength;
                messageArr.push(`${settingControl.label}_must_be_as_least_${minlength}_characters_long`);
            }
            if (formControl.hasError('maxlength')) {
                const maxlength = formControl.errors.maxlength.requiredLength;
                messageArr.push(`${settingControl.label}_exceed_${maxlength}_characters`);
            }
            if (formControl.hasError('pattern')) {
                messageArr.push(`${settingControl.label}_is_not_valid`);
            }
        }
        if (settingControl.key === 'confirmPassword' && !settingControl.validates.isPasswordMatch) {
            messageArr.push(`password_is_not_match`);
        }
        if (settingControl.validates.isDuplicate) {
            messageArr.push(`${settingControl.label}_already_exists`);
        }
        return messageArr;
    }

    getInputValue(settingControls: SettingControlModel<any>[], formGroup: FormGroup, item: {}, exceptionFileds: string[] = []) {
        exceptionFileds.push('confirmPassword');
        settingControls.forEach(settingControl => {
            const formControl = formGroup.get(`${settingControl.key}`);
            if (formControl.dirty && !exceptionFileds.includes(settingControl.key)) {
                if (settingControl.validates?.required) {
                    item[`${settingControl.key}`] = formControl.value;
                } else {
                    switch (settingControl.controlType) {
                        case SettingControlType.Textbox:
                            {
                                item[`${settingControl.key}`] = formControl.value || '';
                                break;
                            }
                        default: {
                            item[`${settingControl.key}`] = formControl.value;
                            break;
                        }
                    }
                }
            } else {
                delete item[`${settingControl.key}`];
            }
            return item;
        });
    }

    validatePasswordMatch(formGroup: FormGroup, settingControls: SettingControlModel<any>[]) {
        this.getSettingControl(settingControls, 'confirmPassword').validates.isPasswordMatch =
            this.getFormControl(formGroup, 'password').value === this.getFormControl(formGroup, 'confirmPassword').value;
    }

    getSettingControl(settingControls: SettingControlModel<any>[], settingControlName: string) {
        return settingControls.find(element => element.key === settingControlName);
    }

    getFormControl(formGroup: FormGroup, settingControlName: string) {
        return formGroup.get(settingControlName);
    }

    validateScroll(settingControls: SettingControlModel<any>[], hasValidateScroll: boolean) {
        settingControls.forEach(settingControl => {
            if (hasValidateScroll) {
                return;
            }
            const element = document.getElementById(`${settingControl.key}_validate_message`);
            if (element) {
                element.scrollIntoView({ block: "center" });
                hasValidateScroll = true;
            }
        });
    }

    checkValidate(formGroup: FormGroup, settingControls: SettingControlModel<any>[]) {
        if (!this.getSettingControl(settingControls, 'confirmPassword')) {
            return formGroup.valid;
        }
        return formGroup.valid
            && this.getSettingControl(settingControls, 'confirmPassword').validates.isPasswordMatch;
    }
}
