import React from "react";

const DisplayNota = (props) => {

    return(
        <div className="divNota">
            <section className={props.className}>{props.valorNota}</section>
        </div>
    )
}

export default DisplayNota;