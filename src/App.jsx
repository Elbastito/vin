import React from 'react'

import Vinlogo from "./assets/vinLogoR.svg"
import VinlogoAmarillo from "./assets/vinLogoA.svg"
import Basura from "./assets/basura.svg"
import Editar from "./assets/editar.svg"
import Nueva from "./assets/nueva.svg"
import Regresar from "./assets/regresar.svg"
import Stack from "./assets/stack.svg"

import useState  from 'react'
import useEffect from 'react'


function App() {
  const [enPantalla, setEnPantalla] = React.useState(false)
  function queSeRenderiza(num){
    setEnPantalla(num)
  }
  
  const [nuevoVin, setNuevoVin] = React.useState({
    IDP: "",
    titulo: "",
    contenido: ""
  })
  function manegarCambioDeForm(event){
    setNuevoVin((prevState)=>{
      return({
        ...prevState,
        [event.target.name]: event.target.value
      })
    })
  }
  function onSubmitFunc(IDP){
    fetch(`https://vin-api.onrender.com/v1/notas/${IDP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoVin)
    })
    .then(response => response.json())
    .catch(error => {
    console.error(error);
  });
  }

  const [vin, setVin] = React.useState({});
  React.useEffect(() => {
    fetch("https://vin-api.onrender.com/v1/notas")
      .then(res => res.json())
      .then(data => setVin(data.notaPadre))
      .catch(error => {
        console.error(error); // Maneja cualquier error de la solicitud
      })
  }, []);
  function regresarAlVinSr(){
    fetch("https://vin-api.onrender.com/v1/notas")
    .then(res => res.json())
    .then((data) => {
      setVin(data.notaPadre)
      setEnPantalla(2)
    })
    .catch(error => {
      console.error(error); // Maneja cualquier error de la solicitud
    })
  }
  
  function cambioDeVin(id){
      fetch(`https://vin-api.onrender.com/v1/notas/${id}?type=single`)
      .then(res => res.json())
      .then(data => setVin(data.notaEncontrada))
      .catch(error => {
        console.error(error); // Maneja cualquier error de la solicitud
      })
  }
  


  const [vins,setVins] = React.useState([])
  React.useEffect(() => {
    fetch(`https://vin-api.onrender.com/v1/notas/${vin._id}?type=multiple`)
      .then(res => res.json())
      .then(data => setVins(data))
      .catch(error => {
        console.error(error); // Maneja cualquier error de la solicitud
      })
  }, [vin]);

  function borrarVin(){
    fetch(`https://vin-api.onrender.com/v1/notas/${vin._id}`, {
    method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // La solicitud DELETE se completó con éxito
        console.log('Recurso eliminado correctamente');
      } 
      else {
        // La solicitud DELETE no se completó con éxito
        console.error('Error al eliminar el recurso');
      }
      regresarAlVinSr()
      setEnPantalla(null)
    })
    .catch(error => {
    // Manejar el error
    console.error(error);
    });
  }

  function editarVin(event){
    console.log(event.target.name)
  }

  return (
    <div className="contenedor">
      <OnClickMenu renderizar={queSeRenderiza} acciondirectaVinSr={regresarAlVinSr} acciondirectaBorrarVin={borrarVin} noEliminarAlVinSr={vin.IDP}/>
      <VinActual titulo={vin.titulo}/>
      {enPantalla===1?
        <NuevoVin manegarCambioDeForm={manegarCambioDeForm} nuevoVinTitulo={nuevoVin.titulo} nuevoVinContenido={nuevoVin.contenido} manegarSubmit={onSubmitFunc} idDelPapa={vin._id}/>:null}
      {enPantalla===2?
        <textarea name="contenido" onChange={editarVin} defaultValue={vin.contenido}></textarea>:null}
      {enPantalla===3?
      <div className='contenedorVinsJr'>
        {
          vins.map((actualVin)=>{
          return <VinsJr titulo={actualVin.titulo} seleccionarVin={cambioDeVin} key={actualVin._id} idParaHacerElCambio={actualVin._id}/>})
        }
      </div>:null
      }
      {enPantalla===4?
      <div className='menuSiNo'>
        <div>Estas seguro?</div>
        <button onClick={borrarVin} type="button">Si</button>
      </div>:null
      }
      {enPantalla===5?
      <div>
        <button onClick={()=>{
          cambioDeVin(vin.IDP)
          setEnPantalla(null)
        }} type="button">Si</button>
      </div>:null
      }
    </div>
  )
}

function VinActual(props){
  return(
    <section className='vinActual'>
      <h1>{props.titulo}</h1>
    </section>
  )
}

function OnClickMenu(props){
  return(
    <nav className="onClickMenu">
      <ul>
        <VinSr acciondirecta={props.acciondirectaVinSr}/>
        <hr />
        <Acciones name="Nueva" renderizar={props.renderizar}icon={Nueva} renderIndex={1}/>
        <Acciones name="Editar" renderizar={props.renderizar} icon={Editar} renderIndex={2}/>
        <Acciones name="Hijas" renderizar={props.renderizar} icon={Stack} renderIndex={3}/>
        <Acciones name="Borrar" renderizar={props.renderizar} icon={Basura} renderIndex={4}/>
        <Acciones name="Regresar" renderizar={props.renderizar} icon={Regresar} renderIndex={5}/>
      </ul>
    </nav>
  )
}

function VinSr(props){
  return(
    <div onClick={props.acciondirecta}>
      <img id="vinSrlogo" src={Vinlogo} alt="vin"/>
    </div>
  )
}

function Acciones(props){
  return(
    <li className="tools" >
      <img onClick={()=>{props.renderizar(props.renderIndex)}} src={props.icon} alt="vin"/>
    </li>
  )
}


function VinsJr(props){
  return(
    <div className='vinsJr' onClick={()=>{props.seleccionarVin(props.idParaHacerElCambio)}}>
      <img id="vinsJrlogo" src={VinlogoAmarillo} alt="vin" />
      <h3>{props.titulo}</h3>
    </div>
  )
}


function NuevoVin(props){
  return(
    <form onSubmit={(event)=>{
    props.manegarSubmit(props.idDelPapa)
    event.preventDefault();
    }} className='NuevoVin'>
      <input type="text" 
      placeholder='Titulo de nuevo vin'
      onChange={props.manegarCambioDeForm}
      name='titulo'
      value={props.nuevoVinTitulo}
      />
      <div id="bar"></div>
      <textarea 
      placeholder='Contenido de vin'
      onChange={props.manegarCambioDeForm}
      name="contenido"
      value={props.nuevoVincontenido}
      />
      <button>Submit</button>
    </form>
  )
}



export default App
