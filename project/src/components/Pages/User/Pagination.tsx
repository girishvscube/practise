import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { makeStyles, createStyles } from '@mui/styles';

const useStyles = makeStyles(() => createStyles({
  ul: {
    '& .MuiPaginationItem-root': {
      color: 'white',
      width: '30px',
      height: '30px',
      marginLeft: '10px',
      '&:hover': {
        background: '#FFCD2C',
        color: 'black',
        opacity: 0.2,
      },
      '&:disabled': {
        '& .MuiSvgIcon-root': {
          backgroundColor: '#2F3344',
          color: 'white',

        },
      },
    },
    '& .MuiPaginationItem-root.Mui-selected': {
      backgroundColor: '#FFCD2C',
      color: 'black',
      '&:hover': {
        background: '#FFCD2C',
        opacity: 0.2,
      },
    },
    '& .MuiPaginationItem-icon': {
      backgroundColor: '#FFCD2C',
      borderRadius: '16px',
      color: 'black',
      height: '30px',
      width: '30px',
      '&:hover': {
        background: 'transparent',
        opacity: 0.2,
      },

      '& .MuiPaginationItem-icon': {
        backgroundColor: 'yellow',
      },
    },

  },

}));

interface PaginationProps {
  onChange: any
  page: any,
  count:any

}
const TablePagination = (props: PaginationProps) => {
  const classes = useStyles();

  return (
    <div className="flex gap-8 h-16 justify-center items-center ">
      <Stack spacing={20}>
        <Pagination
          size="small"
          className={classes.ul}
          defaultPage={1}
          shape="rounded"
          count={props.count}
          page={props.page}
          onChange={props.onChange}
        />
      </Stack>

    </div>
  );
};

export default TablePagination;
