import { CustomFlowbiteTheme } from 'flowbite-react';

export const buttonPrimary: CustomFlowbiteTheme['button'] = {
  color: {
    blue: 'text-white bg-blue border border-transparent hover:text-blue hover:bg-whitebg hover:border-blue enabled:hover:bg-blue-800 focus:ring-4 focus:ring-blue-300',
  },
};

export const buttonSecondary: CustomFlowbiteTheme['button'] = {
  color: {
    blue: 'text-blue bg-white border border-blue hover:bg-blue hover:text-white',
  },
};

export const buttonAction: CustomFlowbiteTheme['button'] = {
  color: {
    blue: 'text-white bg-blue border border-transparent focus:ring-4 focus:ring-blue-300',
  },
};
