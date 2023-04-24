import CustomButton from '../../../../common/Button'
import BasicTable from './Table'
import Plus from '../../../../../assets/icons/filledIcons/Plus.svg'
import { useMemo, useState } from 'react'
import Validator from 'validatorjs'

import PopUp from './PopUp'
import axiosInstance from '../../../../../utils/axios'
import Pagination from '../../../../common/Pagination/Pagination'
import { showToastMessage } from '../../../../../utils/helpers'
import Delete from '../../../../../../assets/images/Delete.svg'
import AlertDialog from '../../../../common/DeleteConfirmationPopup'
import CircularProgress from '@mui/material/CircularProgress'

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rolesList, setRolesList] = useState([])
  const [modulesList, setModulesList] = useState([])
  const [params, setParams] = useState({
    name: '',
    role: 'Manager',
    id: '',
    is_manager: false,
    list: [],
  })
  const [meta, setMeta] = useState('' as any)
  const [formErrors, setFormErrors] = useState({
    name: '',
  })

  const [dialogMeta, setDialogMeta] = useState({
    open_add: false,
    open_delete: false,
    id: '',
  } as any)

  const [loading, setLoading] = useState(false)

  const handleFormChanges = (e) => {
    setParams({ ...params, is_manager: e.target.value === 'Manager' ? true : false })
  }

  const onRowDelete = (item) => {
    setDialogMeta({ ...dialogMeta, open_delete: true, id: item.id })
  }

  const handleDelete = () => {
    axiosInstance
      .delete(`/admin/settings/roles/` + dialogMeta.id)
      .then((res) => {
        showToastMessage('Role Deleted Successfully', 'success')
        setDialogMeta({ ...dialogMeta, open_delete: false, id: '' })
        fecthRoles()
      })
      .catch((error) => {
        let { message } = error.response.data.errors
        showToastMessage(message, 'error')
        setDialogMeta({ ...dialogMeta, open_delete: false, id: '' })
      })
  }

  const handleClose = () => {
    setDialogMeta({ ...dialogMeta, open_add: false, open_delete: false, id: '' })
  }
  const createRole = (payload) => {
    axiosInstance
      .post(`/admin/settings/roles`, payload)
      .then((res) => {
        showToastMessage('Created Successfully', 'success')
        setDialogMeta({ ...dialogMeta, open_add: false })
        fecthRoles()
      })
      .catch((error) => {
        let { message } = error.response.data.errors
        showToastMessage(message, 'error')
      })
  }

  const updateRole = (id, payload) => {
    axiosInstance
      .put(`/admin/settings/roles/` + id, payload)
      .then((res) => {
        showToastMessage('Role Updated Successfully', 'success')
        setDialogMeta({ ...dialogMeta, open_add: false })
        fecthRoles()
      })
      .catch((error) => {
        let { message } = error.response.data.errors
        showToastMessage(message, 'error')
      })
  }

  const addPermission = (array, list) => {
    array.push({
      module_id: list.id,
      is_read: list.is_read,
      is_write: list.is_write,
      is_update: list.is_update,
      is_delete: list.is_delete,
    })
    return array
  }

  const submit = () => {
    const rules = {
      name: ['required', 'regex:^[A-Za-zs]$', 'max:50'],
    }
    const validation = new Validator(params, rules)
    if (validation.fails()) {
      const fieldErrors: any = {}
      Object.keys(validation.errors.errors).forEach((key) => {
        fieldErrors[key] = validation.errors.errors[key][0]
      })

      const err = Object.keys(fieldErrors)
      if (err.length) {
        const input: any = document.querySelector(`input[name=${err[0]}]`)
        if (input) {
          input.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'start',
          })
        }
      }

      setFormErrors(fieldErrors)
      return false
    }

    let is_checked = params.list.some((x: any) => x.is_checked)
    if (!is_checked) {
      showToastMessage('Please Select atleast one module!', 'error')
      return
    }

    let permissions: any = []
    for (let list of params.list as any) {
      if (list.is_checked) {
        permissions = addPermission(permissions, list)
        let children = list.children.filter((x: any) => x.is_checked)
        if (children.length) {
          for (let child of children) {
            permissions = addPermission(permissions, child)
          }
        }
      }
    }
    let payload = {
      name: params.name,
      is_manager: params.is_manager,
      permissions: permissions,
    }

    if (params.id) {
      updateRole(params.id, payload)
    } else {
      createRole(payload)
    }
    return
  }

  const onRowEdit = (row) => {
    let options: any = [...modulesList]
    options = options
      .filter((x: any) => x.parent_id == null)
      .map((x: any) => {
        let root_ele = row.permissions.find((y) => y.module_id === x.id)
        x['is_checked'] =
          root_ele?.is_read ||
          root_ele?.is_write ||
          root_ele?.is_delete ||
          root_ele?.is_update ||
          false
        x['is_read'] = root_ele?.is_read || false
        x['is_write'] = root_ele?.is_write || false
        x['is_delete'] = root_ele?.is_delete || false
        x['is_update'] = root_ele?.is_update || false

        x['children'] = modulesList
          .filter((y: any) => y.parent_id === x.id)
          .map((z: any) => {
            let child_ele = row.permissions.find((y) => y.module_id === z.id)
            z['is_checked'] =
              child_ele?.is_read ||
              child_ele?.is_write ||
              child_ele?.is_delete ||
              child_ele?.is_update ||
              false
            z['is_read'] = child_ele?.is_read || false
            z['is_write'] = child_ele?.is_write || false
            z['is_delete'] = child_ele?.is_delete || false
            z['is_update'] = child_ele?.is_update || false
            return z
          })
        return x
      })

    setParams({
      ...params,
      list: options,
      name: row.name,
      role: row.is_manager ? 'Manager' : 'Executive',
      id: row.id,
    })
    setDialogMeta({ ...dialogMeta, open_add: true })
  }

  const handleNestedCheckBoxSel = (list, index, checked, child) => {
    let subIndex = list[index].children.findIndex((x) => x.id === child.id)
    if (subIndex != -1) {
      list[index].children[subIndex].is_checked = checked
      list[index].children[subIndex]['is_write'] = checked
      list[index].children[subIndex]['is_update'] = checked
      list[index].children[subIndex]['is_read'] = checked
      list[index].children[subIndex]['is_delete'] = checked
    }
    let is_child_checked = list[index].children.some((x) => x.is_checked)
    list[index].is_checked = is_child_checked
  }

  const handleChildChange = (e, item, child) => {
    const { name, checked } = e.target
    let list: any = [...params.list]
    let index = list.findIndex((x: any) => x.id == item.id)
    if (index != -1) {
      if (checked && ['is_write', 'is_update', 'is_read', 'is_delete'].includes(name)) {
        list[index].is_checked = checked
        let subIndex = list[index].children.findIndex((x) => x.id === child.id)
        if (subIndex != -1) {
          list[index].children[subIndex].is_checked = checked
          list[index].children[subIndex][name] = checked
        }
      } else if (checked) {
        handleNestedCheckBoxSel(list, index, checked, child)
      }

      if (!checked && ['is_write', 'is_update', 'is_read', 'is_delete'].includes(name)) {
        let subIndex = list[index].children.findIndex((x) => x.id === child.id)
        if (subIndex != -1) {
          list[index].children[subIndex][name] = checked
          let item = list[index].children[subIndex]
          if (!item.is_write && !item.is_update && !item.is_read && !item.is_delete) {
            list[index].children[subIndex].is_checked = checked
          }
          let is_child_checked = list[index].children.some((x) => x.is_checked)
          list[index].is_checked = is_child_checked
        }
      }

      if (!checked && !['is_write', 'is_update', 'is_read', 'is_delete'].includes(name)) {
        handleNestedCheckBoxSel(list, index, checked, child)
      }
    }
    setParams({ ...params, list: list })
  }

  const handleCheckBoxSel = (list, index, checked) => {
    list[index].is_checked = checked
    list[index]['is_write'] = checked
    list[index]['is_update'] = checked
    list[index]['is_read'] = checked
    list[index]['is_delete'] = checked
    list[index].children = list[index].children.map((x) => {
      x['is_checked'] = checked
      x['is_write'] = checked
      x['is_update'] = checked
      x['is_read'] = checked
      x['is_delete'] = checked
      return x
    })
  }

  const handleRootChange = (e, item) => {
    const { name, checked } = e.target
    let list: any = [...params.list]
    let index = list.findIndex((x: any) => x.id == item.id)
    if (index != -1) {
      if (checked && ['is_write', 'is_update', 'is_read', 'is_delete'].includes(name)) {
        list[index].is_checked = checked
        list[index][name] = checked
      } else if (checked) {
        handleCheckBoxSel(list, index, checked)
      }

      if (!checked && ['is_write', 'is_update', 'is_read', 'is_delete'].includes(name)) {
        list[index][name] = checked
        let item = list[index]
        if (!item.is_write && !item.is_update && !item.is_read && !item.is_delete) {
          list[index].is_checked = checked
        }
      }

      if (!checked && !['is_write', 'is_update', 'is_read', 'is_delete'].includes(name)) {
        handleCheckBoxSel(list, index, checked)
      }
    }
    setParams({ ...params, list: list })
  }

  const addNewRole = () => {
    let options: any = [...modulesList]
    options = options
      .filter((x: any) => x.parent_id == null)
      .map((x: any) => {
        x['is_checked'] = false
        x['children'] = modulesList
          .filter((y: any) => y.parent_id === x.id)
          .map((z: any) => {
            z['is_read'] = false
            z['is_write'] = false
            z['is_delete'] = false
            z['is_update'] = false
            z['is_checked'] = false
            return z
          })
        return x
      })

    setParams({ ...params, list: options, is_manager: true })
    setDialogMeta({ ...dialogMeta, open_add: true })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setParams({ ...params, [name]: value })
  }
  const fecthRoles = async () => {
    setLoading(true)
    axiosInstance
      .get(`admin/settings/roles?page=${currentPage}`)
      .then((response) => {
        let data = response.data.data.data
        let modules = response.data.modules
        setMeta(response.data.data.meta)
        setRolesList(data)
        setModulesList(modules)
        setLoading(false)
      })
      .catch((error) => {
        console.log('error:', error)
        setLoading(false)
      })
  }
  useMemo(() => {
    fecthRoles()
  }, [currentPage])

  return (
    <div className='border-border border rounded-lg bg-lightbg p-4'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <p className='subheading'>User Role</p>
          <p className='text-xs font-nunitoRegular'>Add/Remove Items to the List of User Role.</p>
        </div>

        <div>
          <CustomButton
            onClick={(e) => {
              addNewRole()
            }}
            width='w-full'
            variant='outlined'
            size='large'
            borderRadius='8px'
            icon={<img src={Plus} alt='' />}
          >
            Add User Role
          </CustomButton>
        </div>
      </div>

      {loading ? (
        <div className='w-full h-80 flex justify-center items-center'>
          <CircularProgress />
          <span className='text-3xl'>Loading...</span>
        </div>
      ) : (
        <>
          <div className='bg-darkbg mt-4 rounded-lg'>
            <BasicTable rows={rolesList} onRowEdit={onRowEdit} onRowDelete={onRowDelete} />
          </div>
          <Pagination
            className='pagination-bar'
            currentPage={currentPage}
            totalCount={meta.total}
            pageSize={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      <PopUp
        open={dialogMeta.open_add}
        handleClose={handleClose}
        title={params.id ? 'Update User Role' : 'Add New User Role'}
        type='create'
        name=''
        params={params}
        setParams={handleFormChanges}
        submit={submit}
        handleRootChange={handleRootChange}
        handleChildChange={handleChildChange}
        handleChange={handleChange}
        formErrors={formErrors}
      />
      <AlertDialog
        handleDelete={handleDelete}
        open={dialogMeta.open_delete}
        handleClose={handleClose}
        popup='warning'
        button={false}
      />
    </div>
  )
}

export default Users
