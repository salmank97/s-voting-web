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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { ElectionComponent } from './Election/Election.component';
import { VoteComponent } from './Vote/Vote.component';

import { AdministratorComponent } from './Administrator/Administrator.component';
import { SocietyComponent } from './Society/Society.component';
import { CandidateComponent } from './Candidate/Candidate.component';
import { VoterComponent } from './Voter/Voter.component';

import { CastVoteComponent } from './CastVote/CastVote.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Election', component: ElectionComponent },
  // { path: 'Vote', component: VoteComponent },
  { path: 'Administrator', component: AdministratorComponent },
  { path: 'Society', component: SocietyComponent },
  { path: 'Candidate', component: CandidateComponent },
  { path: 'Voter', component: VoterComponent },
  // { path: 'CastVote', component: CastVoteComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
