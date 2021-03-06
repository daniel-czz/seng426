import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export interface IEntitiesMenuProps {
  isNotUser: boolean;
}
export const EntitiesMenu = props => (
  // tslint:disable-next-line:jsx-self-close
  <NavDropdown icon="th-list" name="Banking" id="entity-menu">
    <MenuItem icon="asterisk" to="/entity/customer">
      Customer Details
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/accounts">
      Accounts
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/transaction">
      Transfer Money
    </MenuItem>
    <MenuItem icon="asterisk" to="/entity/file-upload/new">
      Document Upload
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
