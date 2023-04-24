import CustomCheckbox from '../../../../common/input/Checkbox';

const ModulesAccess = ({ params,handleRootChange , handleChildChange}): any => {


  const handleChange = () => {

  };

  return (
    <div>
      {
        params?.list?.map((item) => (
          <div>
            {
              <>
                <div className="flex gap-2 justify-between space-y-2">
                  <div>
                    <p>
                      <CustomCheckbox
                        handleCheck={(e) => handleRootChange(e, item)}                        
                        ischecked={item?.is_checked}
                        color="text-yellow"
                        name={item?.name}
                        Label={item?.name}
                      />
                    </p>
                  </div>
                  {
                    !item.children?.length ?
                      <div className='flex gap-1'>
                        <CustomCheckbox
                          handleCheck={(e) => handleRootChange(e, item)}
                          ischecked={item?.is_write}
                          color="text-yellow"
                          name='is_write'
                          Label='C'
                        />
                        <CustomCheckbox
                          handleCheck={(e) => handleRootChange(e, item)}
                          ischecked={item.is_read}
                          color="text-yellow"
                          name='is_read'
                          Label='R'
                        />
                        <CustomCheckbox
                          handleCheck={(e) => handleRootChange(e, item)}
                          ischecked={item?.is_update}
                          color="text-yellow"
                          name='is_update'
                          Label='U'
                        />
                        <CustomCheckbox
                          handleCheck={(e) => handleRootChange(e, item)}
                          ischecked={item?.is_delete}
                          color="text-yellow"
                          name='is_delete'
                          Label='D'
                        />
                      </div> : <></>
                  }

                </div>

                <div className="flex gap-1 flex-col pl-6">
                  {
                    item?.children?.map((child) => (
                      <>
                        <div className="flex justify-between">
                            <CustomCheckbox
                              ischecked={child?.is_checked}
                              color="text-yellow"
                              name={child?.name}
                              handleCheck={(e) => handleChildChange(e, item,child)}
                              Label={child?.name}
                            />
                            <div className='flex gap-1'>
                          <CustomCheckbox
                            handleCheck={(e) => handleChildChange(e, item,child)}
                            ischecked={child?.is_write}
                            color="text-yellow"
                            name='is_write'
                            Label='C'
                          />
                          <CustomCheckbox
                            handleCheck={(e) => handleChildChange(e, item,child)}
                            ischecked={child.is_read}
                            color="text-yellow"
                            name='is_read'
                            Label='R'
                          />
                          <CustomCheckbox
                            handleCheck={(e) => handleChildChange(e, item,child)}
                            ischecked={child?.is_update}
                            color="text-yellow"
                            name='is_update'
                            Label='U'
                          />
                          <CustomCheckbox
                            handleCheck={(e) => handleChildChange(e, item,child)}
                            ischecked={child?.is_delete}
                            color="text-yellow"
                            name='is_delete'
                            Label='D'
                          />
                        </div>
                        </div>
                        
                      </>
                    ))
                  }
                </div>
              </>
            }
          </div>
        ))
      }
    </div>
  );
};

export default ModulesAccess;
