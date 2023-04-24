import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

interface TabPanelProps {
  children: React.ReactNode
  index: number
  value: number
}

interface BasicTabsProps {
  cols: any
  data: any
}

const useStyles = makeStyles({
  tabs: {
    backgroundColor: '#262938',
    borderRadius: '8px',
    '& .MuiTabs-indicator': {
      backgroundColor: '#FFCD2C',
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#FFCD2C',
      fontFamily: 'Nunito !important',
      fontWeight: '700',
      fontSize: '18px',
      lineHeight: '25px',
    },
    '& .MuiButtonBase-root': { textTransform: 'none' },
  },
});

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: '24px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const customTab = ({ cols, data }: BasicTabsProps) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  let px: string = '48px';

  if (window.innerWidth < 1024) {
    px = '6px';
  }

  const classes = useStyles();

  return (
    <Box sx={{ width: '100%' }} className="w-full h-full bg-[#151929]">
      <Box>
        <div>
          <Tabs
           scrollButtons
           allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
            className={classes.tabs}
            sx={{ border: 1, borderColor: '#404050' }}
          >
            {cols.map((col: any, index: number) => (
              <Tab
                label={(
                  <span className="font-nunitoRegular font-bold text-base">
                    {col.title}
                  </span>
                )}
                sx={{ color: 'white', fontSize: '16px', marginRight: `${px}`, lineHeight: '25px' }}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </div>
      </Box>

      {data.map((item: any, index: any) => (
        <TabPanel value={value} index={index}>
          {item}
        </TabPanel>
      ))}
    </Box>
  );
};

export default customTab;
