import React from 'react';
import { Component } from 'react';
import ProjectProposalForm from './forms/ProjectProposalForm';
class ProjectProposalCreate extends Component {
  constructor(props) {
    super(props);
  }

  testFillData = () => {
    this.setState({
      ...this.state,
      testValues: {
        title: 'something',
        description: 'otherthing',
        branch: 'Executive',
        Department: 'Yangon',
      },
    });
  };
  render() {
    console.log('ProjectProposalCreate render()', this.state);
    return (
      <div>
        <h3 className="mb-4">
          <i className="fas fa-scroll font-large mr-3"></i>
          Create new project proposal
        </h3>
        <ProjectProposalForm />
      </div>
    );
  }
}

export default ProjectProposalCreate;
