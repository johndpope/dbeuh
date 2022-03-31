import { Layout, SiderProps } from 'antd';

const { Sider } = Layout;

export interface ISider extends SiderProps {
  children: React.ReactNode;
}

function NewSider(props: ISider) {
  return (
    <Sider {...props} width={200} className="site-layout-background">
      {props.children}
    </Sider>
  );
}

export { NewSider as Sider };
