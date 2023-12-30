import React from "react";

const OptionButton = (props) => {

    return(
        <div>
            <button className="btnGenerico" id={props.id} onClick={props.onClick}>{props.conteudo}</button>
        </div>
    )
}

export default OptionButton;