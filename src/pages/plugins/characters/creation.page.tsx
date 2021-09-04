import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { MoveToInbox } from '@material-ui/icons';
import React from 'react';
import { CreationDrawer } from './styles';

function CharacterCreation() {
  return (
    <nav className="content">
      <CreationDrawer variant="permanent">
        <ListItem button key="FACE">
          <ListItemIcon><MoveToInbox /></ListItemIcon>
          <ListItemText primary="FACE" />
        </ListItem>
      </CreationDrawer>
    </nav>
  );
}

export default CharacterCreation;
