import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';

export interface SelectorProps {
    id: string;
    marginTop: string | number;
}

export interface SelectorState {
    options: Array<{ value: string | number, content: string }>;
}

class Selector extends Component<SelectorProps, SelectorState, any> {
    public constructor(props: SelectorProps) {
        super(props);
        this.state = {
            options: [{ value: "", content: "选择编号" }]
        };
    }

    public render(): JSX.Element {
        return (
            <select id={this.props.id} style={{width: '50px', marginLeft: '10px', marginTop: this.props.marginTop}}>
                {this.state.options.map((item, index) => {
                    return (
                        <option value={item.value} key={index}>{item.content}</option>
                    );
                })}
            </select>
        );
    }
}

export default Selector;
