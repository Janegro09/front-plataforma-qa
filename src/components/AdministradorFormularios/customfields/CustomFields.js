import React, { Component } from 'react'
import { Label } from 'recharts';

export default class CustomFields extends Component {

    state = {
        results: null
    }

    componentDidMount() {
        let value = this.props.value;
        let results = [];

        if (value) {
            value = value.split('%');
            for (let v of value) {
                let id = v.split('@')[0] || null;
                let value = v.split('@')[1] || null;
                let key = id.split('|')[1] || null;
                id = id.split('|')[0] || null;

                let tempData = {
                    id,
                    value,
                    key
                }

                results.push(tempData)
            }



        }

        this.setState({
            results
        })
    }

    render() {
        let { type, values, id, name } = this.props.field;
        let { results } = this.state;
        let usados = []

        return (
            <>
                <label htmlFor={this.props.name}>{name}</label>
                {results &&
                    results.map(result => {
                        console.log("result: ", result)
                        if (result.id === id) {
                            return (
                                <>
                                    {type === 'text' &&
                                        <input type="text" name={this.props.name} onChange={
                                            this.props.functionOnChange
                                        } defaultValue={result.value} />
                                    }
                                    {type === 'radio' &&
                                        values.map(value => {
                                            return <div key={value}>
                                                <label htmlFor={this.props.name}>{value}</label>
                                                <input type="radio" id="female" name={this.props.name} onChange={
                                                    this.props.functionOnChange
                                                } value={value} defaultChecked={result.value} />
                                            </div>

                                        })
                                    }
                                    {type === 'checkbox' &&
                                        values.map(value => {

                                            if (result.key === value && !usados.includes(value)) {
                                                usados.push(value);
                                                return (<div key={value}>
                                                    <label htmlFor={this.props.name + '|' + value}>{value}</label>
                                                    <input type="checkbox" id="female" name={this.props.name + '|' + value} onChange={
                                                        this.props.functionOnChange
                                                    } value={value} defaultChecked={result.value} />
                                                </div>)
                                            } else if (!usados.includes(value) && !results.find(e => e.key === value)) {
                                                usados.push(value);
                                                return (<div key={value}>
                                                    <label htmlFor={this.props.name + '|' + value}>{value}</label>
                                                    <input type="checkbox" id="female" name={this.props.name + '|' + value} onChange={
                                                        this.props.functionOnChange
                                                    } value={value} />
                                                </div>)
                                            }
                                        })
                                    }
                                    {type === 'select' &&
                                        <select name={this.props.name} onChange={
                                            this.props.functionOnChange
                                        }>
                                            <option value="">Selecciona...</option>
                                            {values.map(value => {
                                                console.log("shramiii: ", value)
                                                return <option value={value} key={value} defaultValue={value}>{value}</option>
                                            })}
                                        </select>
                                    }
                                    {type === 'textarea' &&
                                        <textarea name="" id="" cols="30" rows="10" name={this.props.name} onChange={
                                            this.props.functionOnChange
                                        } defaultValue={result.value}>

                                        </textarea>
                                    }
                                </>
                            )
                        }
                    })

                }

                {!results &&
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
                                    <label htmlFor={this.props.name + '|' + value}>{value}</label>
                                    <input type="checkbox" id="female" name={this.props.name + '|' + value} onChange={
                                        this.props.functionOnChange
                                    } value={value} />
                                </div>
                            })
                        }
                        {type === 'select' &&
                            <select name={this.props.name} onChange={
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
                }
            </>
        )
    }
}
