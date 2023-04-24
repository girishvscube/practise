import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Delete from '../../../../../../assets/images/Delete.svg'
import AlertDialog from '../../../../../../components/common/DeleteConfirmationPopup';
const useStyles = makeStyles(() => ({
  root: {
    '& td ': {
      color: '#FFFFFF',
    },
    '& th ': {
      color: '#6A6A78',
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
const DeliveryTime = ({
  rows,
  handleDelete,
  handleClose,
  open,
  handleClickOpen,
  button
}: any) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table
        aria-label="simple table"
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: '1px solid #404050',
          },
          minWidth: 650,
          //   border: '1px solid #404050',
          // borderCollapse: 'separate',
          // borderSpacing: '0px ',
          //   px: '24px',
          background: '#151929',
          borderRadius: '8px',
          '& .css-zvlqj6-MuiTableCell-root': {
            padding: 0,
          },
        }}
        className={classes.root}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ borderRight: '1px solid #404050' }}>
              <span>Sl No.</span>
            </TableCell>
            <TableCell align="center" sx={{ borderRight: '1px solid #404050' }}>
              <span>Slots</span>
            </TableCell>

            <TableCell align="center">
              <span>Delete</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length > 0
            && rows?.map((row: any) => (
              <TableRow key={row?.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  <div className="flex justify-center gap-6">
                    <p>
                      {row?.id}
                      .
                    </p>
                  </div>

                </TableCell>

                <TableCell align="center">{row?.start} - {row?.end}</TableCell>


                <TableCell align="center">
                  <div className="flex justify-center">

                    <img src={Delete} alt="" className='cursor-pointer ' onClick={() => { handleClickOpen(row?.id) }} />

                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <AlertDialog handleDelete={handleDelete} open={open} handleClose={handleClose} popup="warning" button={button} />

    </TableContainer>
  );
};
export default DeliveryTime;
