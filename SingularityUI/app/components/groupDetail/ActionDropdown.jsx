import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

import { FetchRequest } from '../../actions/api/requests';

import { DropdownButton, MenuItem } from 'react-bootstrap';
import PauseButton from '../common/modalButtons/PauseButton';
import UnpauseButton from '../common/modalButtons/UnpauseButton';
import BounceButton from '../common/modalButtons/BounceButton';
import EnableHealthchecksButton from '../common/modalButtons/EnableHealthchecksButton';
import DisableHealthchecksButton from '../common/modalButtons/DisableHealthchecksButton';

class ActionDropdown extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    requests: PropTypes.object,
    fetchRequest: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = {};
    _.bindAll(this, 'fetchRequests');
  }

  fetchRequests() {
    for (const requestId of _.keys(this.props.requests)) {
      this.props.fetchRequest(requestId);
    }
  }

  render() {
    const { group, requests } = this.props;

    return (
      <DropdownButton
        bsStyle="primary"
        title="Apply to all"
        id="action-dropdown"
        >

        <MenuItem header={true}>Request State</MenuItem>
        <PauseButton requestId={group.requestIds} isScheduled={_.any(_.keys(requests), (requestId) => requests[requestId].requestType === 'SCHEDULED')} then={this.fetchRequests}>
          <MenuItem eventKey="1">Pause</MenuItem>
        </PauseButton>
        <UnpauseButton requestId={group.requestIds} then={this.fetchRequests}>
          <MenuItem eventKey="2">Unpause</MenuItem>
        </UnpauseButton>
        <MenuItem divider={true} />

        <MenuItem header={true}>Healthchecks</MenuItem>
        <EnableHealthchecksButton requestId={group.requestIds} then={this.fetchRequests}>
          <MenuItem eventKey="3">Enable</MenuItem>
        </EnableHealthchecksButton>
        <DisableHealthchecksButton requestId={group.requestIds} then={this.fetchRequests}>
          <MenuItem eventKey="4">Disable</MenuItem>
        </DisableHealthchecksButton>
        <MenuItem divider={true} />

        <BounceButton requestId={group.requestIds} then={this.fetchRequests}>
          <MenuItem eventKey="5">Bounce</MenuItem>
        </BounceButton>

      </DropdownButton>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const requests = ownProps.group && _.pick({...state.api.request}, (value, key) => _.contains(ownProps.group.requestIds, key));
  return ({
    requests
  });
};

const mapDispatchToProps = (dispatch) => ({
  fetchRequest: (requestId) => dispatch(FetchRequest.trigger(requestId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionDropdown);