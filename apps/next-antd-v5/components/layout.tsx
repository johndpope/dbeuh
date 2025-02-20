import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  CopyOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { IMenuProps, IUseResponsive } from '@wsh4and/antd-v5';
import { Breadcrumb, theme, ConfigProvider } from '@wsh4and/antd-v5';
import { ResponsiveLayout, useResponsive } from '@wsh4and/antd-v5';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import 'libs/antd-v5/node_modules/antd/dist/reset.css';
import { MainFooter } from './layout-footer';
import { MainSider } from './layout-sider';
import { MainHeader } from './layout-header';

export const menu1: IMenuProps[] = [
  {
    label: 'Home',
    key: '/',
    icon: <LaptopOutlined />,
  },
  {
    label: 'Coba',
    key: '/coba',
    icon: <CopyOutlined />,
  },
  {
    label: 'Nested',
    key: '',
    icon: <NotificationOutlined />,
    children: [
      {
        label: 'Nested 1',
        key: '/coba-nested',
        icon: <CopyOutlined />,
      },
      {
        label: 'Nested 2',
        key: '/coba-nested2',
        icon: <CopyOutlined />,
      },
    ],
  },
  {
    label: 'Double Nested',
    key: '',
    icon: <UserOutlined />,
    children: [
      {
        label: 'Double Nested 1',
        key: '/coba-nested',
        icon: <CopyOutlined />,
      },
      {
        label: 'Double Nested 2',
        key: '',
        icon: <CopyOutlined />,
        children: [
          {
            label: 'Double Nested 3',
            key: '/coba-nested',
            icon: <CopyOutlined />,
          },
          {
            label: 'Double Nested 4',
            key: '/coba-nested2',
            icon: <CopyOutlined />,
          },
        ],
      },
    ],
  },
];

export interface IMainResponsive {
  style?: IUseResponsive;
  setStyle?: Dispatch<SetStateAction<IUseResponsive>>;
}

export function MainBreadCrumb(props: IMainResponsive) {
  return (
    <Breadcrumb
      style={{
        marginBottom: 8,
        border: '2px solid red',
      }}
    >
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb>
  );
}

type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
};

const defaultTheme: ThemeData = {
  borderRadius: 6,
  colorPrimary: '#FF4500',
};

export default function AppLayout({ children }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { style, setStyle } = useResponsive({ alignment: 'left' });
  const [themes, setThemes] = useState<ThemeData>(defaultTheme);

  return (
    <ConfigProvider
      theme={{
        token: { ...themes },
      }}
    >
      <ResponsiveLayout
        header={<MainHeader style={style} setStyle={setStyle} />}
        breadcrumb={<MainBreadCrumb style={style} />}
        sider={<MainSider style={style} />}
        footer={<MainFooter style={style} />}
        rootLayoutStyle={style.rootLayoutStyle}
        innerLayoutStyle={style.innerLayoutStyle}
        contentStyle={style.contentStyle}
        outerLayoutStyle={style.outerLayoutStyle}
      >
        {children}
      </ResponsiveLayout>
    </ConfigProvider>
  );
}
