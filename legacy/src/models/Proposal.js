import { Status } from '../components/Dashboards/ProposalDashboard/ProjectProposal/constants';

class Proposal {
  constructor() {
    this.title = '';
    this.description = '';
    this.branch = '';
    this.department = '';
    this.authors = [];
    this.emailList = [];
    this.files = [];
    this.isEditable = false;
    this.isFinalized = false;
    this.status = Status.NEW;
    this.uid = '';
  }

  get title() {
      return this.title; 
  }

  addEmail() {
      
  }
}

export default Proposal;
