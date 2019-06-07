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
import { VoterService } from './Voter.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-voter',
  templateUrl: './Voter.component.html',
  styleUrls: ['./Voter.component.css'],
  providers: [VoterService]
})
export class VoterComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  cgpa = new FormControl('', Validators.required);
  semester = new FormControl('', Validators.required);
  hasVoted = new FormControl('', Validators.required);
  id = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);


  constructor(public serviceVoter: VoterService, fb: FormBuilder) {
    this.myForm = fb.group({
      cgpa: this.cgpa,
      semester: this.semester,
      hasVoted: this.hasVoted,
      id: this.id,
      name: this.name
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceVoter.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'one.xord.svoting.Voter',
      'cgpa': this.cgpa.value,
      'semester': this.semester.value,
      'hasVoted': this.hasVoted.value,
      'id': this.id.value,
      'name': this.name.value
    };

    this.myForm.setValue({
      'cgpa': null,
      'semester': null,
      'hasVoted': null,
      'id': null,
      'name': null
    });

    return this.serviceVoter.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'cgpa': null,
        'semester': null,
        'hasVoted': null,
        'id': null,
        'name': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'one.xord.svoting.Voter',
      'cgpa': this.cgpa.value,
      'semester': this.semester.value,
      'hasVoted': this.hasVoted.value,
      'name': this.name.value
    };

    return this.serviceVoter.updateParticipant(form.get('id').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceVoter.deleteParticipant(this.currentId)
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

    return this.serviceVoter.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'cgpa': null,
        'semester': null,
        'hasVoted': null,
        'id': null,
        'name': null
      };

      if (result.cgpa) {
        formObject.cgpa = result.cgpa;
      } else {
        formObject.cgpa = null;
      }

      if (result.semester) {
        formObject.semester = result.semester;
      } else {
        formObject.semester = null;
      }

      if (result.hasVoted) {
        formObject.hasVoted = result.hasVoted;
      } else {
        formObject.hasVoted = null;
      }

      if (result.id) {
        formObject.id = result.id;
      } else {
        formObject.id = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
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
      'cgpa': null,
      'semester': null,
      'hasVoted': null,
      'id': null,
      'name': null
    });
  }
}
