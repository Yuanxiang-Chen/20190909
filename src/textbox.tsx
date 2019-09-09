import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';

export interface TextboxProps {
    id: string
}

export interface TextboxState {
    content: string;
    stair: string;
}

class Textbox extends Component<TextboxProps, TextboxState, any> {
    public constructor(props: TextboxProps) {
        super(props);
        this.state = {
            content: 'undefined',
            stair: 'undefined'
        };
    }

    public render(): JSX.Element {
        return (
            <div id={this.props.id} style={{width: '100%'}}>
                <p style={{color: 'steelblue', fontSize: '24px'}}>意见：{this.state.content}</p>
                <br />
                <p style={{color: 'steelblue', fontSize: '24px'}}>社会层面：{this.state.stair}</p>
            </div>
        );
    }
}


export default Textbox;
