import React, { useState, useCallback } from 'react'
import {
  CCollapse,
  CCard,
  CCardBody,
  CContainer,
  CCardHeader,
  CCol,
  CRow,
  CButton, CFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';

const getColor = (props) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }
  return '#eeeeee';
}

const Container = styled.div`
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
border-width: 2px;
border-radius: 2px;
border-color: ${props => getColor(props)};
border-style: dashed;
background-color: #fafafa;
color: #bdbdbd;
outline: none;
transition: border .24s ease-in-out;
`;

const Dashboard = () => {
  const [collapse, setCollapse] = useState(false);
  const [state, setState] = useState({
    rows: [],
    cols: []
  });
  const toggle = (e)=>{
    setCollapse(!collapse);
    e.preventDefault();
  }



  const StyledDropzone = () => {
    const onDrop = useCallback(acceptedFiles => {
      console.log("MyDropzone: acceptedFiles: ", acceptedFiles)
      let fileObj = acceptedFiles[0];
      ExcelRenderer(fileObj, (err, resp) => {
        console.log("ExcelRenderer: resp = ", resp)
        if(err){
          console.log(err);            
        }
        else{
          setState({
            cols: resp.cols,
            rows: resp.rows
          });
        }
      });  
    }, [])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({onDrop});  

    return (
      <div className="container">
        <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </Container>
      </div>
    );
  }

  return (
    <>
     <CContainer fluid>
       <CCard>
         <CCardHeader>
            <CButton color="primary" onClick={toggle} className={'mb-1'}>Upload File</CButton>
         </CCardHeader>
          <CCollapse show={collapse}>
              <CCardBody>
                  <StyledDropzone/>
              </CCardBody>
          </CCollapse>
       </CCard>
     </CContainer>
    <hr/>
     <CRow>
          {
            state && <OutTable data={state.rows} columns={state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />

          }
     </CRow>
    </>
  )
}

export default Dashboard
