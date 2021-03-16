import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import Slider from '@material-ui/core/Slider';
// import PropTypes from 'prop-types';
// import { withStyles, makeStyles } from '@material-ui/core/styles';
import '../Modal/Slider.css'  
import axios from 'axios';
import Global from '../../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import { createGenerateClassName, Table } from '@material-ui/core';


const get_online = async (idPar,columnName) => {
  const id =idPar;

  if(!id) return;

  const tokenUser = JSON.parse(localStorage.getItem("token"))
  const token = tokenUser
  const bearer = `Bearer ${token}`

  try{
      let response = await axios.get(Global.reasignProgram + '/' + id + '/online/' + columnName, { headers: { Authorization: bearer } });
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


export const ModalPerfilamientoOnline = ({valor,guardar}) => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <VisibilityRoundedIcon
      onClick={() => setModalShow(true)}
      className="verIcon"
      />
      
      {
        modalShow &&         
        <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        valor={valor}
        guardar={guardar}
        />
      }
    </>
  );
}

const MyVerticallyCenteredModal =   (props) => {

  const {codigo, QName} = props.valor;
  const [online, setOnline] = useState();
  const [loading, setLoading] = useState(true)
  const [valores, setValores] = useState([]);
  const [cantidadesCuartiles, setCantidadesCuartiles] = useState([0,0,0,0])

  const arrayInicial = [
    {
      label:"Q1-Min",
      value:props.valor.Q1.VMin
    },
    {
      label:"Q1",
      value:props.valor.Q1.VMax
    },
    {
      label:"Q2",
      value:props.valor.Q2.VMax
    },
    {
      label:"Q3",
      value:props.valor.Q3.VMax
    },
    {
      label:"Q4-Max",
      value:props.valor.Q4.VMax
    }
  ];
  
  let stepRange;

  useEffect(() => {
    
    get_online(codigo,QName).then(v=>{
      if(loading){
        setOnline(v)
        setLoading(false)
        calcularCantCuartiles(arrayInicial,v);
      }
    })
    setValores(arrayInicial)
  }, []);
  
  if(arrayInicial[4].value==1){
    stepRange=(arrayInicial[0].value + arrayInicial[4].value)/100;
  } else {
    stepRange=1
  }
  
  const setearValores = (e) => {
    let sliderValue = parseFloat(e.target.ariaValueNow);
    let valoresTemporales=valores;
    if(valoresTemporales[0].value===sliderValue || valoresTemporales[4].value===sliderValue){
      return;
    }

    if(e.target.dataset.index==0 && (sliderValue < valoresTemporales[2].value)){
      valoresTemporales[1].value=sliderValue;
    } else if (e.target.dataset.index==1 && (sliderValue < valoresTemporales[3].value  && sliderValue > valoresTemporales[1].value)) {
      valoresTemporales[2].value=sliderValue;
    } else if(e.target.dataset.index==2 && (sliderValue > valoresTemporales[2].value)){
      valoresTemporales[3].value=sliderValue;
    } else {
      
    }
    
    setValores([...valoresTemporales]);   

    calcularCantCuartiles(valoresTemporales);
    
  }


  const calcularCantCuartiles = (valoresTemporales,v=false) => {
    let valoresOnline = online;
    if(v){
      valoresOnline=v;
    }
    const [Vmin,Q2,Q3,Q4,Vmax] = valoresTemporales;
    
    let cantQ1=0;
    let cantQ2=0;
    let cantQ3=0;
    let cantQ4=0;

    valoresOnline.map(v => {
      if(Vmin.value<=v && v<=Q2.value){
        cantQ1++
      } else if (Q2.value<v && v<=Q3.value){
        cantQ2++
      } else if (Q3.value<v && v<=Q4.value){
        cantQ3++
      } else if (Q4.value<v && v<=Vmax.value){
        cantQ4++
      }
    });
    setCantidadesCuartiles([cantQ1,cantQ2,cantQ3,cantQ4]);
  }
  
  const guardarValores = (e) => {
    e.preventDefault();
    let valoresReemplazados=props.valor;
    valoresReemplazados.Q1.VMax=valores[1].value;
    valoresReemplazados.Q2.VMin=valores[1].value;
    valoresReemplazados.Q2.VMax=valores[2].value;
    valoresReemplazados.Q3.VMin=valores[2].value;
    valoresReemplazados.Q3.VMax=valores[3].value;
    valoresReemplazados.Q4.VMin=valores[3].value;
    props.guardar(valoresReemplazados);
    props.onHide();
  }

  return (
    <>      
    {
      !loading && 
    
      <Modal
      {...props}
      guardar={props.guardar()}
      //   key={props.valor.QName}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.valor.QName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Prueba</h4>
          <p>
              Prueba de perfilamiento Online
          </p>
          <div className="sliderContainer">
          <h5></h5>
          <Slider
              key={`slider-${valores.map((v,i)=>{return v.value+i})}`}
              max={valores[4].value}
              min={valores[0].value}
              // track={false}
              name="valores"
              defaultValue={[valores[1].value, valores[2].value,valores[3].value]}
              valueLabelDisplay="on"
              aria-labelledby="discrete-slider-always"
              // onChcange={setearValores}
              onClick={setearValores}
              marks={valores}
              step={stepRange}
            />

          <div className="contenedor-cuartiles">
            <h4>Detalles Valores</h4>          
          </div>
          <Table 
            striped={"true"}
            bordered={"true"}
            hover={"true"}>
            <thead>
              <tr>
                <th>#</th>
                <th>Q1 Min</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Q4 Max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Valores</td>
                {valores.map(v=>{
                  return <td key={v.value}>{v.value}</td>
                })}
              </tr>
            </tbody>
          </Table>

          <h4>Detalles Cantidades</h4>          
          <Table 
            striped={"true"}
            bordered={"true"}
            hover={"true"}>
            <thead>
              <tr>
                <th>#</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cantidades</td>
                {
                  cantidadesCuartiles.map((v,i) => {
                    return <td key={i}> {v} </td>
                  })
                }
              </tr>
            </tbody>
          </Table>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button  onClick={guardarValores}>Guardar</Button>
          <Button variant="secondary" onClick={props.onHide}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
}
    </>
  );
}

