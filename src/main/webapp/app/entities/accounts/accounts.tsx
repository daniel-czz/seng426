import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getEntities, getFilteredEntity } from './accounts.reducer';
import { IAccounts } from 'app/shared/model/accounts.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getSession } from 'app/shared/reducers/authentication';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { IFilterState } from './FilterUtils';
export type IAccountsState = IFilterState;

export interface IAccountsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

// export type IAccountsState = IPaginationBaseState;

export class Accounts extends React.Component<IAccountsProps, IAccountsState> {
  state: IAccountsState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE),
    accountId: 0
  };

  componentDidMount() {
    this.props.getSession();
    this.getEntities();
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortEntities()
    );
  };

  sortEntities() {
    this.getEntities();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortEntities());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  handleFilterIdChange = (event: any) => {
    this.setState({
      accountId: event.target.value
    });
    if (event.target.value) {
      this.props.getFilteredEntity(event.target.value);
    } else {
      this.getEntities();
    }
  };

  render() {
    const { accountsList, match, totalItems, isNotUser } = this.props;
    return (
      <div>
        <h2 id="accounts-heading">
          Accounts
          {isNotUser ? (
            <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
              <FontAwesomeIcon icon="plus" />
              &nbsp; Create a new Account
            </Link>
          ) : (
            <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
              <FontAwesomeIcon icon="plus" />
              &nbsp; Request For a new Account
            </Link>
          )}
        </h2>
        {isNotUser ? (
          <div>
            <input
              type="text"
              placeholder="Filter By Account Id"
              className="form-control txtAccountIdFilter"
              onChange={this.handleFilterIdChange}
              value={this.state.accountId > 0 ? this.state.accountId : ''}
            />
          </div>
        ) : null}
        <div className="table-responsive">
          {accountsList && accountsList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={this.sort('accountID')}>
                    Account ID <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('accountType')}>
                    Account Type <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('balance')}>
                    Balance <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('activated')}>
                    Activated <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    Customer <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    Branch <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {accountsList.map((accounts, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${accounts.accountID}`} color="link" size="sm">
                        {accounts.accountID}
                      </Button>
                    </td>
                    <td>{accounts.accountType}</td>
                    <td>{accounts.balance}</td>
                    <td>{accounts.activated ? 'true' : 'false'}</td>
                    <td>{accounts.userLogin ? <Link to={`customer/${accounts.customerID}`}>{accounts.userLogin}</Link> : ''}</td>
                    <td>{accounts.branchAddress ? <Link to={`branch/${accounts.branchID}`}>{accounts.branchAddress}</Link> : ''}</td>
                    <td className="text-right">
                      {isNotUser && (
                        <div className="btn-group flex-btn-group-container">
                          <Button tag={Link} to={`${match.url}/${accounts.accountID}`} color="info" size="sm">
                            <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                          </Button>
                          <Button tag={Link} to={`${match.url}/${accounts.accountID}/edit`} color="primary" size="sm">
                            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                          </Button>
                          <Button tag={Link} to={`${match.url}/${accounts.accountID}/delete`} color="danger" size="sm">
                            <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Accounts found</div>
          )}
        </div>
        <div className={accountsList && accountsList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={this.state.activePage} total={totalItems} itemsPerPage={this.state.itemsPerPage} />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={this.state.activePage}
              onSelect={this.handlePagination}
              maxButtons={5}
              itemsPerPage={this.state.itemsPerPage}
              totalItems={this.props.totalItems}
            />
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ accounts, authentication }: IRootState) => ({
  accountsList: accounts.entities,
  totalItems: accounts.totalItems,
  isNotUser: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN, AUTHORITIES.STAFF, AUTHORITIES.MANAGER])
});

const mapDispatchToProps = {
  getEntities,
  getSession,
  getFilteredEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts);
