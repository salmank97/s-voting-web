import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace one.xord.svoting{
   export abstract class Entity extends Participant {
      id: string;
      name: string;
   }
   export class Administrator extends Entity {
   }
   export class Society extends Entity {
      presidentId: string;
   }
   export class Candidate extends Entity {
      cgpa: number;
      semester: number;
      pastExperience: string;
      totalVotes: number;
      society: Society;
      election: Election;
   }
   export class Voter extends Entity {
      cgpa: number;
      semester: number;
      hasVoted: boolean;
   }
   export class Election extends Asset {
      id: string;
      prepareTime: number;
      startTime: number;
      endTime: number;
      position: string;
      totalVotes: number;
      societies: Society[];
   }
   export class Vote extends Asset {
      id: string;
      owner: Entity;
   }
   export class VoteEvent extends Event {
      status: string;
      message: string;
   }
   export class CastVote extends Transaction {
      voteId: string;
      voterId: string;
      candidateId: string;
      electionId: string;
   }
// }
