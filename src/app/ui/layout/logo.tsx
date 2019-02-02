import { Avatar } from '@material-ui/core';
import { AvatarProps } from '@material-ui/core/Avatar';
import React from 'react';

export const Logo = (p: AvatarProps) => (
  <Avatar {...p} src="img/calculators.png" />
);
