import Menu from '@mui/material/Menu';

interface Props {
  anchorEl: any
  handleMenu: any
  CloseMenu: any
  Open: any
  order: any
}

const CustomMenu: React.FC<Props> = ({
  order,
  Open,
  anchorEl,
  handleMenu,
  CloseMenu,
}) => (
  <div>
    <p
      className="cursor-pointer"
      id="basic-button"
      aria-controls={Open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={Open ? 'true' : undefined}
      onClick={handleMenu}
    />

    <Menu
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      sx={{
        color: 'white',
        '.css-6hp17o-MuiList-root-MuiMenu-list ': {
          color: 'white !important',
        },
        '& .MuiList-root': {
          padding: '0 !important',
        },
        '& .MuiMenuItem-root': {
          borderBottom: '1px solid #404050 !important',
        },
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          width: '20% !important',
          backgroundColor: '#333748 !important',
        },
      }}
      id="basic-menu"
      anchorEl={anchorEl}
      open={Open}
      onClose={CloseMenu}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <div className="divstyles">
        {order?.customer_delivery_detail?.address_type}
        <p className="wrap">
          {order?.customer_delivery_detail?.address_1}
          {' '}
          {order?.customer_delivery_detail?.address_2}
          {' '}
          {order?.customer_delivery_detail?.city}
          {' '}
          {order?.customer_delivery_detail?.state}
          {' '}
          {order?.customer_delivery_detail?.pincode}
        </p>

        {order?.customer_delivery_detail?.phone ? (
          <p>
            Phone : +91
            {order?.customer_delivery_detail?.phone}
          </p>
        ) : null}
      </div>
    </Menu>
  </div>
);

export default CustomMenu;
