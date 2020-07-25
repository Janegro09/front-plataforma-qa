import React, { Component } from 'react'
import { Label } from 'recharts';

export default class CustomFields extends Component {


    // componentDidMount() {
    //     console.log(this.props.field);
    // }

    render() {
        let { type, values, id, name } = this.props.field;
        return (
            <>

                <label htmlFor={this.props.name}>{name}</label>
                {type === 'text' &&
                    <input type="text" name={this.props.name} onChange={
                        this.props.functionOnChange
                    } />
                }
                {type === 'radio' &&
                    values.map(value => {
                        return <div key={value}>
                            <label htmlFor={this.props.name}>{value}</label>
                            <input type="radio" id="female" name={this.props.name} onChange={
                                this.props.functionOnChange
                            } value={value} />
                        </div>

                    })
                }
                {type === 'checkbox' &&
                    values.map(value => {
                        return <div key={value}>
                            <label htmlFor={this.props.name+'|'+value}>{value}</label>
                            <input type="checkbox" id="female" name={this.props.name+'|'+value} onChange={
                        this.props.functionOnChange
                    } value={value} />
                        </div>
                    })
                }
                {type === 'select' &&
                    <select name={this.props.name}  onChange={
                        this.props.functionOnChange
                    }>
                        <option value="">Selecciona...</option>
                        {values.map(value => {
                            return <option value={value} key={value}>{value}</option>
                        })}
                    </select>
                }
                {type === 'textarea' &&
                    <textarea name="" id="" cols="30" rows="10" name={this.props.name} onChange={
                        this.props.functionOnChange
                    }>

                    </textarea>
                }

            </>
        )
    }
}
