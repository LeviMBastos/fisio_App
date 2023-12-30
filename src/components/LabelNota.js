import React from "react";

const LabelNota = (props) => {

    return(
        <div>
            <label htmlFor={props.id}>{props.txtLabel}</label>
            <input 
                type="text"
                id={props.id} 
                value={props.value}
                onInput={props.onInput}
                autoComplete="off"></input>
        </div>
    )
}

export default LabelNota;