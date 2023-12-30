import React, { useState, useEffect } from 'react';
import './App.css';
// import MyBody from './components/MyBody';
import OptionButton from './components/OptionButton';
import LabelNota from './components/LabelNota';
import DisplayNota from './components/DisplayNota'

import gradeCurricular from './jsonFiles/grade-curricular.json';

function App() {

  const [semestres, setSemestres] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [html, setHtml] = useState(<div></div>);

  useEffect(() => {
    setSemestres(gradeCurricular.semestres)
  }, []);

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semestres]);

  function init () {

    setTitulo("Fisioterapia");

    var botoes = [];

    var contador = Object.keys(semestres).length;

    for(var i = 1; i <= contador; i++){
      botoes.push(<OptionButton key={i} id={i} onClick={(e)=>getDisciplinas(e, this)} conteudo={(i) + "º Semestre"}></OptionButton>)
      botoes.push(<br key={`bf-${i}`}/>)
    }

    setHtml(
      <div className="App">
        <h2>{titulo}</h2>
        {botoes}
      </div>
    )
  }

  function getDisciplinas (event, context) {
    var idSemestre = event.target.id;

    var titulo = idSemestre + "º Semestre";

    var txtSemestre = "Semestre" + idSemestre;
    var disciplinas = gradeCurricular.semestres[txtSemestre].Disciplinas;
    
    var botoes = [];

    disciplinas.forEach(element => {
      botoes.push(<br key={`br-${element}`}/>);
      botoes.push(<br key={`bf-${element}`}/>);
      botoes.push(<OptionButton key={element} id={element} onClick={(e)=>getNotas(e, this, idSemestre)} conteudo={(element)}></OptionButton>);
    });

    botoes.push(<br key={`br-${"back"}`}/>);
    botoes.push(<OptionButton key="voltar" id="voltar" onClick={() => init()} conteudo="Voltar"></OptionButton>)
 
    setHtml(
      <div className="App">
        <h2>{titulo}</h2>
        {botoes}
      </div>
    )
  }

  function getNotas(event, context, idSemestre){

    var labels = [];
    var classNameDisplay;

    var nomeMateria = event.target.id;
    var quantidadeNotas = localStorage.getItem(nomeMateria);

    if(quantidadeNotas == null){
      localStorage.setItem(nomeMateria, 2);
      quantidadeNotas = 2;
    }

    var mediaNotas = 0;

    for(var i = 1; i <= quantidadeNotas; i++){
      var valorNota = localStorage.getItem(nomeMateria + i);

      if(valorNota)
        mediaNotas += parseFloat(valorNota);
      else
        valorNota = "";

      labels.push(<br key={`br-${i}`}/>)
      labels.push(<LabelNota key={"nota" + i} id={nomeMateria + i} value={valorNota} txtLabel={"P" + i + ":    "} onInput={(e) => salvaValorNotas(e, event, idSemestre)}></LabelNota>)
    }

    if(mediaNotas > 0){
      mediaNotas = mediaNotas / quantidadeNotas;

      const casasDecimais = (mediaNotas % 1 !== 0) ? 1 : 0;

      mediaNotas = mediaNotas.toFixed(casasDecimais);
    }

    if(mediaNotas === 0)
      classNameDisplay = 'exibeNota';
    else if (mediaNotas >= 7)
      classNameDisplay = 'exibeNotaVerde';
    else if (mediaNotas < 7)
      classNameDisplay = 'exibeNotaVermelha';

    setHtml(
      <div className="App">
        <h2>{nomeMateria}</h2>
        <div className='btnsNotas'>
          <button className='btnAdicao' onClick={() => alteraQuantidadeNotas("adicao", idSemestre, nomeMateria, quantidadeNotas, event)}>+</button>
          <button className='btnSubtracao' onClick={() => alteraQuantidadeNotas("subtracao", idSemestre, nomeMateria, quantidadeNotas, event)}>-</button>
        </div>
        <br></br>
        <div className='notas'>
        {labels}
        </div>
        <br key={`br-${"back"}`}/>
        <DisplayNota className={classNameDisplay} valorNota={mediaNotas}></DisplayNota>
        <br></br>
        <OptionButton key="voltar" id={idSemestre} onClick={(e)=>getDisciplinas(e, this)} conteudo="Voltar"></OptionButton>
      </div>
    )
  }

  function alteraQuantidadeNotas(tipo, idSemestre, nomeMateria, quantidadeNotas, event){

    var quantidade = parseInt(quantidadeNotas, 10)
    if(tipo === "adicao"){
      if(quantidade < 5)
        localStorage.setItem(nomeMateria, quantidade + 1);
    }
    else{
      if(quantidade > 2){
        localStorage.setItem(nomeMateria, quantidade - 1);
        localStorage.removeItem(nomeMateria + quantidade)
      }
    }

    getNotas(event, null, idSemestre);
  }

  function salvaValorNotas(event, eventGetNotas, idSemestre){
    
    let { value } = event.target;

    value = value.replace(/[^\d.]/g, '');

    value = value.replace(/^0+(\d)/, '$1');

    if (value.startsWith('.')) {
      value = '';
    }

    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
      const decimalPart = value.substring(dotIndex + 1);
      if (decimalPart.includes('.')) {
        value = value.substring(0, dotIndex + 1) + decimalPart.replace('.', '');
      } else {
        value = `${value.substring(0, dotIndex + 1)}${decimalPart.charAt(0)}`;
      }
    }

    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      if(value.includes('.') && parsedValue === 10)
        value = value.slice(0, -1);

      value = (parsedValue < 0) ? '0' : (parsedValue > 10) ? "" : value;
    }

    event.target.value = value;

    localStorage.setItem(event.target.id, event.target.value)
    getNotas(eventGetNotas, null, idSemestre)
  }

  return html;
}

export default App;
