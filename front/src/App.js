
import './styles.css';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import * as d3 from "d3";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            domiciliarios : [],
            pedidos : [],
            width:600,
            height:600,
            encontrado:undefined
        }
        this.escoger = this.escoger.bind(this);
        this.get_info = this.get_info.bind(this);
        this.dar_domicilio = this.dar_domicilio.bind(this);
        this.render_encontrado = this.render.bind(this);
        
        
    }
    
    componentDidMount(){
        fetch("http://localhost:8000/domicilios/fetch_info/")
        .then(response => response.json())
        .then(data => {
            this.setState({domiciliarios:data});

            //graficar
            let width = this.state.width;
            let height = this.state.height;

            //crear canvas
            let svg = d3.select(this.refs.map)
                .append("svg")
                .attr("width",width+50)
                .attr("height",height+50)
                .append("g")
                .attr("transform","translate(25,50)");
            ;
            //crear ejes y agregarlos
            let x = d3.scaleLinear()
                .domain([0,100])
                .range([0,width-35])
                ;
            let y = d3.scaleLinear()
                .domain([0,100])
                .range([height-30,0])
                ;
            svg.append("g")
                .attr("transform", `translate(0,${height-30})`)
                .call(d3.axisBottom(x));
            svg.append("g").call(d3.axisLeft(y));

            //agregar domiciliarios
            svg.append("g")
                .selectAll("dot")
                .data(this.state.domiciliarios)
                .enter()
                .append("circle")
                    .attr("cx",function(d){return x(d.x)})
                    .attr("cy",function(d){return y(d.y)})
                    .attr("r",5)
                    .style("fill","black")
                ;
            
        });
    }


    escoger(){
        fetch("http://localhost:8000/domicilios/fetch_info/")
        .then(response => response.json())
        .then(data => {
            this.setState({domiciliarios:data});
            let distancia_min = 10001;
            let escogido = undefined;
            let x1 = parseInt(findDOMNode(this.refs.x_pedido).value);
            let y1 = parseInt(findDOMNode(this.refs.y_pedido).value);
            if(x1 >= 0 && x1 <= 100 && y1 >= 0 && y1 <= 100 ){ //si está dentro de los límites
                let x2 = 0;
                let y2 = 0;
                let euclideana = 10001;
                for(let i=0 ; i < this.state.domiciliarios.length ; i++){                   
                    x2 = this.state.domiciliarios[i].x;
                    y2 = this.state.domiciliarios[i].y;
                    euclideana = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
                    if(euclideana < distancia_min){
                        distancia_min = euclideana;
                        escogido = this.state.domiciliarios[i];
                    }
                }  
                //guardar pedido en la base de datos              
                let pedido = {
                    x_domiciliario : escogido.x,
                    y_domiciliario : escogido.y,
                    x_pedido : x1,
                    y_pedido : y1,
                    id_domiciliario_escogido : escogido.id,
                    distancia : distancia_min.toFixed(4)
                };
           

                fetch("http://localhost:8000/domicilios/crear/",{
                    method: 'POST', 
                    body: JSON.stringify(pedido),
                    headers:{
                    'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .catch(error => console.error('Error:', error))
                .then(data => {
                    console.log('Success:', data)

                    //graficar

                    let width = this.state.width;
                    let height = this.state.height;

                    //limpiar canvas
                    d3.select("svg").selectAll("*").remove();
                    d3.select("svg").remove();
                    //crear canvas
                    let svg = d3.select(this.refs.map)
                        .append("svg")
                        .attr("width",width+50)
                        .attr("height",height+50)
                        .append("g")
                        .attr("transform","translate(25,50)");
                    ;
                    //crear ejes y agregarlos
                    let x = d3.scaleLinear()
                        .domain([0,100])
                        .range([0,width-35])
                        ;
                    let y = d3.scaleLinear()
                        .domain([0,100])
                        .range([height-30,0])
                        ;
                    svg.append("g")
                        .attr("transform", `translate(0,${height-30})`)
                        .call(d3.axisBottom(x));
                    svg.append("g").call(d3.axisLeft(y));

                    //agregar domiciliarios
                    svg.append("g")
                        .selectAll("dot")
                        .data(this.state.domiciliarios)
                        .enter()
                        .append("circle")
                            .attr("cx",function(d){return x(d.x)})
                            .attr("cy",function(d){return y(d.y)})
                            .attr("r",5)
                            .style("fill","black")
                        ;
                    
                    
                    //pintar el pedido de rojo
                    svg.append("g")
                    .append("circle")
                        .attr("cx",x(x1))
                        .attr("cy",y(y1))
                        .attr("r",5)
                        .style("fill","red")
                    ;
                    //pintar lo de adentro del domiciliario de rojo
                    svg.append("g")
                    .append("circle")
                        .attr("cx",x(escogido.x))
                        .attr("cy",y(escogido.y))
                        .attr("r",5)
                        .style("fill","green")
                    ;
                    alert(`el domiciliario con id ${pedido.id_domiciliario_escogido} recogerá su pedido`);
                    
                });


            }
            else{
                alert("por favor ingrese un valor dentro de [100,100]")
            }

            })
    }
    
    get_info(){
        fetch("http://localhost:8000/domicilios/lista/")
            .then(response => response.json())
            .then(data => {
                this.setState({pedidos:data});                                                          
            });
    }
    dar_domicilio(){
        const id = findDOMNode(this.refs.id_buscado).value;
        fetch(`http://localhost:8000/domicilios/dar_domicilio_por_id/${id}/`)
        .then(response=>response.json())
        .catch(error => {console.error('Error:', error);alert("None found")})
        .then(data => {
            this.setState({encontrado:data});
            console.log(data);
        });
    }
    mostrar_encontrado(){
        if(this.state.encontrado !== undefined){
            console.log(this.state.encontrado)
            return(
                <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                        <h5>Pedido #{this.state.encontrado.id} asignado a domiciliario #{this.state.encontrado.id_domiciliario_escogido}</h5>
                        <ul className="card-text">
                            <li>
                                <p>coordenadas pedido: ({this.state.encontrado.x_pedido},{this.state.encontrado.y_pedido})</p>
                            </li>
                            <li>
                                <p>coordenadas domiciliario escogido: ({this.state.encontrado.x_domiciliario},{this.state.encontrado.y_domiciliario})</p>
                            </li>
                            <li>
                                <p>distancia recorrida en el domicilio: {this.state.encontrado.distancia}</p>
                            </li>
            
                        </ul>
                    </div>
                    <br></br>
                </div>
            )
        }
        else{
            return 
        }
            
        
    }
    render() {
        return (
            <div id='container'>
                <h1>¿Quién puede recoger el pedido?</h1>
                <br></br>
                <p>Esta aplicación calcula el domiciliario más cercano a un pedido ingresado por el usuario, lo guarda, puede muestra el historial de domicilios y puede encontrar uno ya existente</p>
                
                <h4>Historial</h4>
                <button onClick={() => {
                    this.get_info();
                   
                }}>Mostrar</button>
                
                <div>
                    {this.state.pedidos.map(p=>{
                        
                        return(
                        <div key={p.id} className="card" style={{width: "18rem"}}>
                            <div className="card-body">
                                <h5>Pedido #{p.id} asignado a domiciliario #{p.id_domiciliario_escogido}</h5>
                                <ul className="card-text">
                                    <li>
                                        <p>coordenadas pedido: ({p.x_pedido},{p.y_pedido})</p>
                                    </li>
                                    <li>
                                        <p>coordenadas domiciliario escogido: ({p.x_domiciliario},{p.y_domiciliario})</p>
                                    </li>
                                    <li>
                                        <p>distancia recorrida en el domicilio: {p.distancia}</p>
                                    </li>
                    
                                </ul>
                            </div>
                        </div>
                        )
                    
                    })}
                </div>
                
                <h4>Búsqueda de Domicilio por Id</h4>
                <input type="number" ref="id_buscado" placeholder="ingrese id de domicilio a buscar"></input>
                <br></br>
                <button onClick={this.dar_domicilio}>Buscar</button>
                {this.mostrar_encontrado()}
                
                <h4>Ingresar Pedido</h4>
                <input type="number" ref="x_pedido" placeholder="ingrese coordenada x"></input>
                <input type="number" ref="y_pedido" placeholder="ingrese coordenada y"></input>
                <br></br>
                <button onClick={this.escoger}>Buscar</button>
                
                <p style={{marginTop:"20px"}}>A continuación se ve un mapa de donde se encuentran los domiciliarios. 
                    Cuando Ingrese datos de un <span style={{color:"red"}}>pedido</span>, este aparecerá como un punto rojo y el  
                    <span style={{color:"green"}}> domiciliario</span> escogido como un punto verde.
                </p>
                <div ref="map"></div>
            </div>
        );
    }
}
export default App;
/*
{
    "x_domiciliario" : 12,
    "y_domiciliario" : 12,
    "x_pedido" : 12,
    "y_pedido" : 12,
    "id_domiciliario_escogido" :12 ,
    "distancia": 12 
}
*/ 
/*
fetch("http://localhost:8000/domicilios/lista/")
.then(response => response.json())
.then(data => {
    this.setState({pedidos:data}); 
    console.log("llamandose")
        
            

            
                                        
});
*/
/*
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
*/

 