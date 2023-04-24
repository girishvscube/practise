import BankAccounts from './BankAccounts/BankAccounts';
import Contents from './Contents/Contents';
import Tab from '../Customer/View/Tab/Tab';

const TabConstants = [
  {
    title: 'Contents',
  },
  {
    title: 'Bank Accounts',
  },
];
const Main = () => (
  <div>
    <Tab
      cols={TabConstants}
      data={[<Contents />, <BankAccounts />]}
    />
  </div>
);

export default Main;
