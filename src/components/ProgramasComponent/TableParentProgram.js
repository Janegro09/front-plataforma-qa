import React, { Component } from 'react'

export default class TableParentProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultValue: null,
            selected: []
        }

    }

    componentDidMount = () => {
        const { defaultValue } = this.props;

        this.setState({ defaultValue })
    }

    agregar = (e) => {
        e.preventDefault();
        const { selected } = this.state;
        const id = e.target.dataset.id;
        let s = this.state.defaultValue.find(e => e.id === id);
        if(s) {
            this.setState({
                selected: [...selected, s]
            })
        }
    }
    eliminar = (e) => {
        e.preventDefault();
        let { selected } = this.state;
        let retData = [];
        const id = e.target.dataset.id;
        for(let s of selected) {
            if(s.id === id) continue;
            retData.push(s);
        }  
        this.setState({ selected: retData });
    }
    
    render() {
        const { defaultValue, selected } = this.state;
        return (
            <div>
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        {defaultValue &&
                            defaultValue.map((v, i) => {
                                let exist = selected.find(e => e.id === v.id);
                                return (<tr key={i}>
                                    <td>{v.name}</td>                           
                                    <td>
                                        {exist &&
                                            <button data-id={v.id} onClick={this.eliminar}>Eliminar</button>
                                        }
                                        {!exist &&
                                            <button data-id={v.id} onClick={this.agregar}>Agregar</button>
                                        }
                                        
                                    </td>
                                </tr>)
                            })

                        }

                    </tbody>
                </table>
            </div>
        )
    }
}
