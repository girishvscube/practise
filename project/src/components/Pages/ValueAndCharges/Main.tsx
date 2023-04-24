import Tab from './Tab'
import SellingPriceList from './SellingPriceList';
import PurchasePriceList from './PurchasePriceList';
import DeliveryChargesList from './DeliveryChargesList';
import LatePayChargesList from './LatePayChargesList';
import ActivityLog from './ActivityLog';

const TabConstants = [
  {
    title: 'Selling Price',
  },
  {
    title: 'Purchasing Price',
  },
  {
    title: 'Delivery Charges',
  },
  {
    title: 'Late Pay Charges',
  },
  {
    title: 'Activity Logs',
  }
];
const Layout = () => (
  <div className="custom-tab">
    <Tab
      cols={TabConstants}
      data={[<SellingPriceList />,<PurchasePriceList />, <DeliveryChargesList />,<LatePayChargesList />,<ActivityLog />]}
    />
  </div>
);

export default Layout;
