import React, { Component } from 'react'

export default class CustomFields extends Component {


    // componentDidMount() {
    //     console.log(this.props.field);
    // }

    render() {
        let { type, values, id } = this.props.field;

        console.log(this.props.field);
        console.log("type: ", type);
        console.log("values: ", values);
        return (
            <>

                {type === 'text' &&
                    <input type="text" />
                }
                {type === 'radio' &&
                    values.map(value => {
                        return <div key={value}>
                            <label htmlFor={id}>{value}</label>
                            <input type="radio" id="female" name={id} value={value} />
                        </div>

                    })
                }
                {type === 'checkbox' &&
                    values.map(value => {
                        return <div key={value}>
                            <label htmlFor={id}>{value}</label>
                            <input type="checkbox" id="female" name={id} value={value} />
                        </div>
                    })
                }
                {type === 'select' &&
                    <select>
                        {values.map(value => {
                            return <option value={value} key={value}>{value}</option>
                        })}
                    </select>
                }
                {type === 'textarea' &&
                    <textarea name="" id="" cols="30" rows="10">

                    </textarea>
                }

            </>
        )
    }
}
