import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import '../Modal/Slider.css'  
import axios from 'axios';
import Global from '../../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';


const get_online = async (idPar,columnName) => {
  const id =idPar;

  if(!id) return;

  const tokenUser = JSON.parse(localStorage.getItem("token"))
  const token = tokenUser
  const bearer = `Bearer ${token}`

  try{
      let response = await axios.get(Global.reasignProgram + '/' + id + '/online/' + columnName, { headers: { Authorization: bearer } });
      console.log(response.data.Data)
      return response.data.Data || false;
  } catch(e) {
      // Si hay algún error en el request lo deslogueamos
      if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
          HELPER_FUNCTIONS.logout()
      } else {
          localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
          // swal("Error!", "Hubo un problema", "error");
          swal("Error!", `${e.response.data.Message}`, "error");
      }
      console.log("Error: ", e)
  }   
}


export const ModalPerfilamientoOnline = ({valor}) => {
  const [modalShow, setModalShow] = React.useState(false);
  const habilitarOnline = () => {
    setModalShow(true);
  }
  const [loading, setLoading] = useState(true)
  // const [valor.id, setstate] = useState(idPar)
  return (
    <>
      <VisibilityRoundedIcon
      onClick={()=>setModalShow(true)}
      className="verIcon"
      />
      
      {
        modalShow &&         
        <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        valor={valor}
        />
      }
    </>
  );
}

const MyVerticallyCenteredModal = ({valor,show,onHide}) => {
  const {codigo, QName} = valor;
  
  const [values, setValues] = useState()
  
  const valores2 = [
    {
      label:"Q2",
      value:valor.Q1.VMax
    },
    {
      label:"Q3",
      value:valor.Q2.VMax 
    }
  ];

  useEffect(() => {
    setValues(
      [
        {
          label:"Q1",
          value:valor.Q1.VMin
        },
        {
          label:"Q2",
          value:valor.Q1.VMax
        },
        {
          label:"Q3",
          value:valor.Q2.VMax
        },
        {
          label:"Q4",
          value:valor.Q4.VMax
        }
      ]
    )
    return () => {
    
    }
  }, []);


  return (
    <>      
    {
        HELPER_FUNCTIONS.backgroundLoading() &&
      !loading
    }
      <Modal
      // {...props}
      //   key={props.valor.QName}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {valor.QName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Titulo en H4</h4>
          <p>
              Prueba de perfilamiento Online
          </p>
          <div className="sliderContainer">
          
          <Slider
          max={valores[3].value}
          min={valores[0].value}
          track={false}
          defaultValue={valores2.map( e => {return e.value})}
          valueLabelDisplay="on"
          aria-labelledby="discrete-slider-always"
          marks={valores}
          />
        
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

