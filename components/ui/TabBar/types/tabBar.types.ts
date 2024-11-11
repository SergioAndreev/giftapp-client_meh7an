export interface Tab {
  icon: (props?: any) => JSX.Element;
  label: string;
  route: string;
  root?: boolean | false;
}
