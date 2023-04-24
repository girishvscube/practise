import React, { useEffect, useMemo, useState } from 'react';
import OrderTable from './Table';
import AddpocForm from './PocForm';
import axiosInstance from '../../../../../utils/axios';

import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import AlertDialog from '../../../../../components/common/DeleteConfirmationPopup';
import { showToastMessage } from '../../../../../utils/helpers';

interface PocListProps {
  supplierId: any
}
const initialValues = {
  poc_name: '',
  contact: '',
  email: '',
  designation: '',
  image: '',
};
const PocList = ({ supplierId }: PocListProps) => {
  const { createSuccess, editSuccess } = useSelector((state: any) => state.supplierPoc);
  const [open, setOpen] = React.useState({
    deliveryPopup: false,
    updateLocationPopup: false,
    pocPopUp: false,
    updatePocPopUp: false,
    deleteConfirmation: false,
  });
  const [params, setParams] = useState(initialValues);
  const [formErrors, setFormErrors] = useState(initialValues);
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(false)
  const [cancel, setCancel] = useState(false)
  const [pocId, setPocId] = useState()
  const [button, setButton] = useState(false)
  const setOpenPocForm = () => {
    setOpen({ ...open, pocPopUp: true });
  };

  const setOpenPocFormEdit = () => {
    setOpen({ ...open, updatePocPopUp: true });
  };

  const deletePoc = (id: any) => {
    setButton(true)
    axiosInstance.delete(`/admin/supplier-poc/${id}`).then(() => {
      setOpen({ ...open, deleteConfirmation: false });
      setButton(false)
      showToastMessage('Successfully Deleted', 'success')
      fetchPocs();
    }).catch((err) => {
      setButton(false)
      showToastMessage('Error', 'error')
    });
  };

  useEffect(() => {
    fetchPocs();
  }, [supplierId, createSuccess, editSuccess]);

  const fetchPocs = () => {
    setLoading(true)
    axiosInstance
      .get(`/admin/supplier/view/poc/${supplierId}`)
      .then((response) => {
        setPocs(response?.data?.data);
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      });
  };
  const closePocPopUp = () => {
    setOpen({ ...open, updatePocPopUp: false });
    setOpen({ ...open, pocPopUp: false });

    setFormErrors(initialValues);
    setParams(initialValues);
  };



  const handleClickOpen = (id: any) => {
    setPocId(id)
    setOpen({ ...open, deleteConfirmation: true });
  }



  const Confirmation = async () => {
    deletePoc(pocId)
    if (cancel) {
      setOpen({ ...open, deleteConfirmation: false });
    }
  }

  const onCancel = () => {
    setOpen({ ...open, deleteConfirmation: false });
    setCancel(true)
  }
  return (
    <div className="mobileView bg-lightbg flex flex-col gap-6">


      {
        loading ? (
          <div className="w-full h-96 flex justify-center items-center">
            <CircularProgress />
            <span className="text-3xl">Loading...</span>
          </div>) : <div className="bg-darkbg  rounded-lg">
          <OrderTable
            rows={pocs}
            open={open.updatePocPopUp}
            handleClickOpen={setOpenPocFormEdit}
            params={params}
            handleClose={closePocPopUp}
            setFormParams={setParams}
            setFormErrors={setFormErrors}
            supplier_id={supplierId}
            type="create"
            pocId=""
            deletePoc={deletePoc}
            fetchPocs={fetchPocs}
            handleClickOpenDelete={handleClickOpen}
          />
        </div>
      }

      <AddpocForm
        open={open.pocPopUp}
        handleClickOpen={setOpenPocForm}
        handleClose={closePocPopUp}
        params={params}
        setFormParams={setParams}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        supplier_id={supplierId}
        type="create"
        pocId=""
        fetchPocs={fetchPocs}
      />



      <AlertDialog handleDelete={Confirmation} open={open.deleteConfirmation} handleClose={onCancel} popup="warning" button={button} />
    </div>
  );
};

export default PocList;
