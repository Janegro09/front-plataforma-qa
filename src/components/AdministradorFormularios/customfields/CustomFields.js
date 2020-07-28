import React, { Component } from 'react'

export default class CustomFields extends Component {

    state = {
        results: null,
        print: []
    }

    componentDidMount() {
        let { fields, section, subsection, name, values } = this.props;

        let print = [];

        if(values) {
            values = JSON.parse(values);
        } else{
            values = [];
        }

        // Analizamos los fields dependiendo la seccion
        for(let f of fields) {
            if(f.section === section && f.subsection === subsection){
                let tempValue = values.find(e => e.id === f.id);

                let tempData = {
                    id: f.id,
                    name: f.name,
                    sectionName: name,
                    required: f.required,
                    defaultValue: '',
                    type: f.type,
                    values: f.values
                }
                if(tempValue){
                    tempData.defaultValue = tempValue.defaultValue;
                }

                // Analizamos si existen valores para ese campo
                print.push(tempData);
            }

        }

        this.setState({
            print
        })
    }

    changeValues = (e,input, inputRadio = '') => {
        let { type, value, id } = e.target
        let { print } = this.state 
        if(type === 'checkbox'){
            value = e.target.checked;
        } 


        console.log(e.target);
        for(let p of print) {
            if(p.id === input.id){
                if(type === 'radio'){
                    p.defaultValue = `${inputRadio}|${value}`
                } else if(type === 'checkbox') {
                    let newValue = `${inputRadio}|${value}`;
                    console.log('defaaayt', p.defaultValue);

                    if(p.defaultValue){
                        // Dividimos la data a ver si ya existe, sino la agregamos, y si existe cambiamos el valor a false
                        let vals = p.defaultValue.split('@');
                        let defaultValueReturn = [];
                        let existe = false;
                        p.defaultValue = "";
                        for(let i of vals) {
                            let section = i.split('|');
                            let value = section[1];
                            section = section[0];
                            defaultValueReturn.push({
                                section,
                                value
                            });
                        }
                        
                        // Devolvemos los valores al string
                        for(let dv of defaultValueReturn) {
                            if(dv.section === inputRadio) {
                                dv.value = dv.value === 'true' ? 'false' : 'true';
                                existe = true;
                            }

                            let n = `${dv.section}|${dv.value}`;

                            p.defaultValue = p.defaultValue ? p.defaultValue += `@${n}` : n;
                        }

                        if(!existe) {
                            p.defaultValue = p.defaultValue ? p.defaultValue += `@${inputRadio}|${value}` : `${inputRadio}|${value}`;
                        }

                    } else {
                        p.defaultValue = newValue;
                    }
                } else {
                    p.defaultValue = value;
                }
            }
        }

        this.setState({
            print
        })

        this.props.data(JSON.stringify(print));
        
    }

    render() {

        const { print } = this.state;

        return (
            <>
                {print &&
                    print.map(value => {
                        return (
                            <>  
                                <label>{value.name}</label>
                                {value.type === 'text' &&
                                    <input type="text" required={value.required} name={value.sectionName} value={value.defaultValue} onChange={(e) => {
                                        this.changeValues(e, value);
                                    }}/>
                                }
                                {value.type === 'textarea' &&
                                    <textarea cols="30" rows="10" required={value.required} name={value.sectionName}/>
                                }
                                {value.type === 'select' &&
                                    <select required={value.required} name={value.sectionName} value={value.defaultValue} onChange={(e) => this.changeValues(e, value)}>
                                        <option value='-'>Selecciona...</option>
                                        {value.values.map(v => {
                                            return <option value={v}>{v}</option>
                                        })
                                        }
                                    </select>
                                }
                                {value.type === 'radio' &&
                                    <>
                                        {value.values && 
                                        
                                            value.values.map(v => {
                                                let section = value.defaultValue.split('|');
                                                let defVal = section[1];
                                                section = section[0];
                                                if(section === v && defVal === 'on') {
                                                    defVal = 'on';
                                                } else {
                                                    defVal = false;
                                                }
                                                return (
                                                    <>
                                                        <input type="radio" name={value.sectionName} checked={defVal} onChange={(e) => this.changeValues(e, value, v)}/>
                                                        <label>{v}</label>
                                                    </>
                                                )
                                            })

                                        }
                                    </> 
                                }
                                {value.type === 'checkbox' &&
                                    <>
                                        {value.values && 
                                            value.values.map(v => {
                                                let vals = value.defaultValue.split('@');
                                                let defVal = false;
                                                for(let i of vals) {
                                                    let section = i.split('|');
                                                    let temp = section[1];
                                                    section = section[0];
                                                    if(section === v && temp === 'true') {
                                                        defVal = true;
                                                    }
                                                }

                                                return (
                                                    <>
                                                        <input type="checkbox" id={v} name={value.sectionName} checked={defVal} onChange={(e) => {this.changeValues(e, value, v);}}/>
                                                        <label>{v}</label>
                                                    </>
                                                )
                                            })

                                        }
                                    </>                                    
                                }
                            </>
                        )
                    })
                }
            </>
        );
    }
}
