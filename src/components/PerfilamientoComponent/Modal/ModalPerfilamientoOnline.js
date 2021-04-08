import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import Slider from '@material-ui/core/Slider';
// import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import '../Modal/Slider.css'  
import axios from 'axios';
import Global from '../../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import { createGenerateClassName, Table } from '@material-ui/core';

const IOSSlider = withStyles({
  // root,colorPrimary,colorSecondary,marked,vertical,disabled,rail,track,trackFalse,trackInverted,thumb,thumbColorPrimary,thumbColorSecondary,active,focusVisible,valueLabel,mark,markActive,markLabel,markLabelActive,
  // markLabel:{
  //   background: '#000',
  //   height:10,
  //   width:10
  // },
  valueLabel: {
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },

})(Slider);

const get_online = async (idPar,columnName) => {
  const id =idPar;

  if(!id) return;

  const tokenUser = JSON.parse(localStorage.getItem("token"))
  const token = tokenUser
  const bearer = `Bearer ${token}`

  try{
      let response = await 
      axios({
        method:'post',
        url: Global.reasignProgram + '/' + id + '/online/',
        headers: { Authorization: bearer },
        data:{
          columnName
        }
      });      
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

const MyVerticallyCenteredModal = (props) => {

  const [online, setOnline] = useState();
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState(['']);
  const [sliderAsc, setSliderAsc] = useState(['']);
  const [orden, setOrden] = useState('');
  const [valores, setValores] = useState([]);
  const [valoresAsc, setValoresAsc] = useState([]);
  const [valoresOnline, setValoresOnline] = useState([]);
  const [cantidadesCuartilesDESC, setcantidadesCuartilesDESC] = useState([0,0,0,0]);
  const [cantidadesCuartilesASC, setcantidadesCuartilesASC] = useState([0,0,0,0]);
  
  const ordenPerfilamiento=props.valor.Qorder;
  
  const arrayInicial = [
    {
      label:"Q1-Min",
      value:parseFloat(props.valor.Q1.VMin)
    },
    {
      label:"Q1",
      value:parseFloat(props.valor.Q1.VMax)
    },
    {
      label:"Q2",
      value:parseFloat(props.valor.Q2.VMax)
    },
    {
      label:"Q3",
      value:parseFloat(props.valor.Q3.VMax)
    },
    {
      label:"Q4-Max",
      value:parseFloat(props.valor.Q4.VMax)
    }
  ];

  const arrayInicialAsc = [
    {
      label:"Q1-Min",
      value:parseFloat(props.valor.Q4.VMax)
    },
    {
      label:"Q1",
      value:parseFloat(props.valor.Q3.VMax)
    },
    {
      label:"Q2",
      value:parseFloat(props.valor.Q2.VMax)
    },
    {
      label:"Q3",
      value:parseFloat(props.valor.Q1.VMax)
    },
    {
      label:"Q4-Max",
      value:parseFloat(props.valor.Q1.VMin)
    }
  ];
  
  useEffect(() => {
    setOrden(props.valor.Qorder);
    const {codigo, QName} = props.valor;
    
    get_online(codigo,QName).then(v=>{
      let invertidos=[];
      if(loading){
        setOnline(v);
        setLoading(false);
        calcularCantCuartiles(arrayInicial,v);
        let i=0;
        let anterior=v[0];
        let onlineValues=[{label:"",value:anterior}];
        v.map(a=>{
          if(anterior!==a){
            onlineValues=[...onlineValues,{label:"",value:parseFloat(a)}];
          }
          anterior=a;
          i++;
        });
        if(props.valor.Qorder=='DESC'){
          onlineValues[0].label="Q1-Min";
          onlineValues[onlineValues.length-1].label="Q4-Max";  
        } else {
          onlineValues[onlineValues.length-1].label="Q1-Min";
          onlineValues[0].label="Q4-Max";            
        }
        
        invertidos=onlineValues.map(z=>{return {
          "label":z.label,
          "value":z.value*(-1)
        }});
        setValoresAsc(invertidos);
        setValoresOnline(onlineValues);
      }
    });
    if(props.valor.Qorder=='DESC'){
      setValores(arrayInicial);
    }
    if(props.valor.Qorder=='ASC'){
      setValores(arrayInicialAsc);
    }

    
    setSlider([arrayInicial[1].value, arrayInicial[2].value,arrayInicial[3].value])
    setSliderAsc([arrayInicial[1].value*(-1), arrayInicial[2].value*(-1),arrayInicial[3].value*(-1)])
  }, []);

  let valoresSolamente=arrayInicial;

  valoresSolamente=valoresSolamente.map(a=> {
    return a.value
  })

  const handleChangeASC = (e) =>{
    let sliderValue = parseFloat(e.target.ariaValueNow);
    let indice=parseInt(e.target.dataset.index);
    if(isNaN(sliderValue)){
      alert("Tenes que mantenerte en el deslizador para calcular el perfilamiento Online")
    }
    
    let valoresTemporales=valores;
    // valoresTemporales.reverse();
    if(indice===2 && (sliderValue < valoresTemporales[1].value)){      
      valoresTemporales[3].value=sliderValue;
    } else if (indice===1 && (sliderValue > valoresTemporales[3].value  || sliderValue < valoresTemporales[2].value)) {
      valoresTemporales[2].value=sliderValue;
    } else if(indice===0 && (sliderValue > valoresTemporales[2].value)){
      valoresTemporales[1].value=sliderValue;
    } else {
      
    }
    // valoresTemporales.reverse();
    
    calcularCantCuartiles(valoresTemporales);
    setValores([...valoresTemporales]);   
  } 
  
  const handleChange = (e) => {
    
    let sliderValue = parseFloat(e.target.ariaValueNow);
    let indice=parseInt(e.target.dataset.index);
    if(isNaN(sliderValue)){
      alert("Tenes que mantenerte en el deslizador para calcular el perfilamiento Online")
    }

    let valoresTemporales=valores;

    if(indice===0 && (sliderValue < valoresTemporales[2].value)){      
      valoresTemporales[1].value=sliderValue;
    } else if (indice===1 && (sliderValue < valoresTemporales[3].value  && sliderValue > valoresTemporales[1].value)) {
      valoresTemporales[2].value=sliderValue;
    } else if(indice===2 && (sliderValue > valoresTemporales[2].value)){
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
    if(props.valor.Qorder=='DESC'){
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
    } else {
      valoresOnline.map(v => {
        if(Vmax.value<=v && v<=Q4.value){
          cantQ1++
        } else if (Q4.value<v && v<=Q3.value){
          cantQ2++
        } else if (Q3.value<v && v<=Q2.value){
          cantQ3++
        } else if (Q2.value<v && v<=Vmin.value){
          cantQ4++
        }
      });
    }
    setcantidadesCuartilesDESC([cantQ1,cantQ2,cantQ3,cantQ4]);
    if([cantQ1,cantQ2,cantQ3,cantQ4]==[0,0,0,0]){
    } else {
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
      setcantidadesCuartilesASC([cantQ4,cantQ3,cantQ2,cantQ1]);
    }
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

  const valorAbsoluto = (x) => {
    if(x<0){
      return -x;
    } else {
      return x;
    }
  }
  
  return (
    <>      
    {
      !loading && 
      <Modal
      {...props}
      guardar={props.guardar()}
      key={props.valor.QName}
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
          <h4>Orden {props.valor.Qorder}</h4>
          <p>
              Prueba de perfilamiento Online
          </p>
          <div className="sliderContainer">
          <h5></h5>
          {
            props.valor.Qorder=='DESC' &&
            <IOSSlider  
            key={`${valoresOnline.map((v,i)=>{ return v.value+i})}`}
            max={valores[4].value}
            min={valores[0].value}
            defaultValue={slider}
            valueLabelDisplay="auto"
            aria-labelledby="discrete-slider-always"
            onChangeCommitted={handleChange}
            marks={valoresOnline}
            step={null}
            />
          }

          {
            props.valor.Qorder=='ASC' && 
              <IOSSlider  
              key={`${valoresAsc.map((v,i)=>{ return v.value+i})}`}
              max={valores[4].value*(-1)}
              min={valores[0].value*(-1)}
              defaultValue={sliderAsc}
              valueLabelDisplay="auto"
              aria-labelledby="discrete-slider-always"
              onChangeCommitted={handleChangeASC}
              marks={valoresAsc}
              step={null}
              scale={valorAbsoluto}
              />
          }

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
                    {valores.map((v,i)=>{
                      return <td key={v.value+i}>{v.value}</td>
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
                  props.valor.Qorder=='ASC' ?
                  cantidadesCuartilesASC.map((v,i) => {
                  return <td key={i}> {v} </td>
                })
                :
                cantidadesCuartilesDESC.map((v,i) => {
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

