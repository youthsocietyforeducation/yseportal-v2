import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import history from '../../history'

class DashboardNavigator extends Component {
  render() {
    return (
      <div className="i-dashboard-navigator-root-frame">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
          <li className="breadcrumb-item">
              <Link to=' ' className="homeLink" onClick={ () => history.goBack() }>
                <span className="homeButton"><i className="fas fa-arrow-circle-left mr-2"></i></span>
              </Link>
            </li>
          <li className="breadcrumb-item">
              <Link to='/' className="homeLink">
                <span className="homeButton"><i className="fas fa-home mr-2"></i>HOME</span>
              </Link>
            </li>
          
           
          </ol>
        </nav>
      </div>
    );
  }
}
export default connect(null,{})(DashboardNavigator);
