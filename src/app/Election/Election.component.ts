/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ElectionService } from './Election.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-election',
  templateUrl: './Election.component.html',
  styleUrls: ['./Election.component.css'],
  providers: [ElectionService]
})
export class ElectionComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  id = new FormControl('', Validators.required);
  prepareTime = new FormControl('', Validators.required);
  startTime = new FormControl('', Validators.required);
  endTime = new FormControl('', Validators.required);
  position = new FormControl('', Validators.required);
  totalVotes = new FormControl('', Validators.required);
  societies = new FormControl('', Validators.required);

  constructor(public serviceElection: ElectionService, fb: FormBuilder) {
    this.myForm = fb.group({
      id: this.id,
      prepareTime: this.prepareTime,
      startTime: this.startTime,
      endTime: this.endTime,
      position: this.position,
      totalVotes: this.totalVotes,
      societies: this.societies
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceElection.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'one.xord.svoting.Election',
      'id': this.id.value,
      'prepareTime': this.prepareTime.value,
      'startTime': this.startTime.value,
      'endTime': this.endTime.value,
      'position': this.position.value,
      'totalVotes': this.totalVotes.value,
      'societies': ["resource:one.xord.svoting.Society#".concat(this.societies.value)]
      // 'societies': this.societies.value
    };

    this.myForm.setValue({
      'id': null,
      'prepareTime': null,
      'startTime': null,
      'endTime': null,
      'position': null,
      'totalVotes': null,
      'societies': null
    });

    return this.serviceElection.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'id': null,
        'prepareTime': null,
        'startTime': null,
        'endTime': null,
        'position': null,
        'totalVotes': null,
        'societies': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'one.xord.svoting.Election',
      'prepareTime': this.prepareTime.value,
      'startTime': this.startTime.value,
      'endTime': this.endTime.value,
      'position': this.position.value,
      'totalVotes': this.totalVotes.value,
      'societies': this.societies.value
    };

    return this.serviceElection.updateAsset(form.get('id').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceElection.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceElection.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'id': null,
        'prepareTime': null,
        'startTime': null,
        'endTime': null,
        'position': null,
        'totalVotes': null,
        'societies': null
      };

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.prepareTime) {
        formObject.prepareTime = result.prepareTime;
      } else {
        formObject.prepareTime = null;
      }

      if (result.startTime) {
        formObject.startTime = result.startTime;
      } else {
        formObject.startTime = null;
      }

      if (result.endTime) {
        formObject.endTime = result.endTime;
      } else {
        formObject.endTime = null;
      }

      if (result.position) {
        formObject.position = result.position;
      } else {
        formObject.position = null;
      }

      if (result.totalVotes) {
        formObject.totalVotes = result.totalVotes;
      } else {
        formObject.totalVotes = null;
      }

      if (result.societies) {
        formObject.societies = result.societies;
      } else {
        formObject.societies = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'id': null,
      'prepareTime': null,
      'startTime': null,
      'endTime': null,
      'position': null,
      'totalVotes': null,
      'societies': null
      });
  }

}
