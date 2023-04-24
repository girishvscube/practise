import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { makeStyles } from '@mui/styles';
import { uuid } from '../../utils/helpers';

const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#FFFFFF',
    },
  },

  tr: {
    '& td:first-child ': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',

    },
    '& td:last-child ': {
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
    },
  },
}));

interface Props {
  cols: any,
  data: any[]
}

const CommonTable: React.FC<Props> = ({
  data,
  cols,
}) => {
  const classes = useStyles();

  return (
    <TableContainer className="tabel-container" component={Paper} sx={{ alignItems: 'center' }}>
      <Table
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: 'none',
          },
          minWidth: 650,
          borderCollapse: 'separate',
          borderSpacing: '0px 20px',
          px: '24px',
          borderRadius: '8px',
          '& .css-zvlqj6-MuiTableCell-root': {
            padding: 0,
          },
        }}
        className={`${classes.root} custom-table`}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            {
                            cols.map((element: any) => (
                              <TableCell align="center" sx={{ color: '#6A6A78' }} key={uuid()}>{element.header}</TableCell>
                            ))
                        }
          </TableRow>
        </TableHead>
        <TableBody>
          {
                        data.map((item: any) => (
                          <TableRow
                            key={uuid()}
                            sx={{ height: '16px', backgroundColor: '#151929' }}
                            className={classes.tr}
                          >
                            {
                                    cols.map((col: any) => (
                                      <TableCell align="center" key={uuid()}>{item[col.key]}</TableCell>
                                    ))
                                }
                          </TableRow>
                        ))
                    }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
