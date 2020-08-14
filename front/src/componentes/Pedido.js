import React, { Component } from 'react';

class Pedido extends Component {
    constructor(props){
        super(props);
        this.state = this.props.pedido;
    }
    
    render() {
        console.log("que psa");
        return (
            <div>
                <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                        <h5>Pedido #{this.state.id} asignado a domiciliario #{this.state.id_domiciliario_escogido}</h5>
                        <ul className="card-text">
                            <li>
                                <p>coordenadas pedido: ({this.state.x_pedido},{this.state.y_pedido})</p>
                            </li>
                            <li>
                                <p>coordenadas domiciliario escogido: ({this.state.x_domiciliario},{this.state.y_domiciliario})</p>
                            </li>
                            <li>
                                <p>distancia recorrida en el domicilio: {this.state.distancia}</p>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Pedido;