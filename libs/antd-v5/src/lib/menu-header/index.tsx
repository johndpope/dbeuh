import { Header, Menu, MenuTheme } from '../../index';
import { MenuMode } from 'rc-menu/lib/interface';
import { CSSProperties } from 'react';
import { IMenuProps } from '../menu-link/menu-link';

/* eslint-disable-next-line */
export interface MenuHeaderProps {
  style?: CSSProperties;
  theme?: MenuTheme;
  mode?: MenuMode;
  menus: IMenuProps[];
  defaultSelectedKeys?: string[];
}

export function MenuHeader(props: MenuHeaderProps) {
  return (
    <Header
      style={{
        paddingInline: '0px',
        color: 'rgba(0, 0, 0, 0.88)',
        ...props.style,
      }}
    >
      <Menu
        theme={props.theme || 'light'}
        mode={props.mode || 'horizontal'}
        defaultSelectedKeys={props.defaultSelectedKeys}
        items={props.menus}
      />
    </Header>
  );
}

export default MenuHeader;
