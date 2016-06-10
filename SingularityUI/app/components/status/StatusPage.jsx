import React from 'react';
import HostStates from './HostStates';
import StatusList from './StatusList';
import Breakdown from './Breakdown';
import Link from '../common/atomicDisplayItems/Link';
import TimeStamp from '../common/atomicDisplayItems/TimeStamp';
import PlainText from '../common/atomicDisplayItems/PlainText';

export default class StatusPage extends React.Component {

  renderPercentage(number, total) {
    return number > 0 ? `(${Math.round(number/total * 100)}%)` : '';
  }

  getRequestsData() {
    return this.props.requests.map((r) => {
      return (
        {
          component: Link,
          beforeFill: r.type,
          prop: {
            text: `${r.count} ${r.label} ${this.renderPercentage(r.count, this.props.model.allRequests)}`,
            url: `${config.appRoot}${r.link}`,
            value: r.count,
            id: r.type
          }
        }
      );
    });
  }

  getTasksData() {
    let res = this.props.tasks.map((t) => {
      return (
        {
          component: Link,
          beforeFill: t.type,
          prop: {
            text: `${t.count} ${t.label} ${this.renderPercentage(t.count, this.props.totalTasks)}`,
            url: `${config.appRoot}${t.link}`,
            value: t.count,
            id: t.type
          }
        }
      );
    });
    return res;
  }

  renderTaskLag() {
    if (this.props.model.maxTaskLag > 0) {
      return (
        <h4>
          <TimeStamp prop={{
            timestamp: this.props.model.maxTaskLag,
            display: 'duration',
            prefix: 'Max Task Lag:'
           }} />
        </h4>
      );
    }
  }

  render() {
    let m = this.props.model;
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h2>Requests</h2>
            <div className="row">
              <div className="col-md-3 col-sm-3 hidden-xs chart">
                <Breakdown total={m.allRequests} data={this.props.requests} />
              </div>
              <div className="col-md-9 col-sm-9">
                <StatusList data={this.getRequestsData()} />
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <h2>Tasks</h2>
              <div className="col-md-3 col-sm-3 hidden-xs chart">
                <Breakdown total={this.props.totalTasks} data={this.props.tasks} />
              </div>
              <div className="col-md-9 col-sm-9">
                <StatusList data={this.getTasksData()} />
                {this.renderTaskLag()}
              </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <StatusList
              header="Racks"
              data={[
                {
                  component: Link,
                  prop: {
                    text: `${m.activeRacks} Active Racks`,
                    url: `${config.appRoot}/racks/active`,
                    id: 'activeracks',
                    value: m.activeRacks
                  }
                },
                {
                  component: Link,
                  prop: {
                    text: `${m.decomissioningRacks} Decommissioning Racks`,
                    url: `${config.appRoot}/racks/decommission`,
                    id: 'decomracks',
                    value: m.decomissioningRacks
                  }
                },
                {
                  component: Link,
                  prop: {
                    text: `${m.deadRacks} Inactive Racks`,
                    url: `${config.appRoot}/racks/inactive`,
                    id: 'inactiveracks',
                    value: m.deadRacks
                  }
                }
              ]}
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <StatusList
              header="Slaves"
              data={[
                {
                  component: Link,
                  prop: {
                    text: `${m.activeSlaves} Active Slaves`,
                    url: `${config.appRoot}/slaves/active`,
                    value: m.activeSlaves,
                    id: 'activeslaves'
                  }
                },
                {
                  component: Link,
                  prop: {
                    text: `${m.decomissioningSlaves} Decommissioning Slaves`,
                    url: `${config.appRoot}/slaves/decommission`,
                    value: m.decomissioningSlaves,
                    id: 'decomslaves'
                  }
                },
                {
                  component: Link,
                  prop: {
                    text: `${m.deadSlaves} Inactive Slaves`,
                    url: `${config.appRoot}/slaves/inactive`,
                    className: m.deadSlaves > 0 ? 'color-warning' : '',
                    value: m.deadSlaves,
                    id: 'deadslaves'
                  }
                },
                m.unknownSlaves ? {
                  component: Link,
                  prop: {
                    text: `${m.unknownSlaves} Unknown Slaves`,
                    url: `${config.appRoot}/slaves/inactive`,
                    className: 'color-warning',
                    value: m.unknownSlaves,
                    id: 'unknownslaves'
                  }
                } : undefined
              ]}
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <StatusList
              header="Deploys"
              data={[
                {
                  component: PlainText,
                  prop: {
                    text: `${m.numDeploys} Active Deploys`,
                    className: m.numDeploys < 2 ? 'text-muted' : '',
                    value: m.numDeploys,
                    id: 'numdeploys'
                  }
                },
                m.oldestDeploy != 0 ? {
                  component: TimeStamp,
                  prop: {
                      timestamp: m.oldestDeploy,
                      display: 'duration',
                      postfix: 'since last deploy'
                  }
                } : undefined
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <HostStates hosts={m.hostStates} />
          </div>
        </div>
      </div>
    );
  }
}

StatusPage.propTypes = {};
