'use client';

import { logoutAction } from '../lib/actions';
import { Button } from 'flowbite-react';
import { buttonPrimary } from './buttonTheme';

export default function LogoutButton() {
  return (
    <Button
      onClick={() => {
        logoutAction();
      }}
      pill
      theme={buttonPrimary}
      color='blue'
    >
      Logout
    </Button>
  );
}
