/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:51 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-17 11:51:30
 */
import React, { Component } from 'react';
import $ from 'jquery';
import './bootstrap.css';
import './style.css';
import { Source } from './LdaSvg';


export interface TextboxProps {
    id: string,
    setText: ((year: number, source: Source, index: number) => void) | ((content: string, stair: string) => void);
}

export interface TextboxState {
    content: string;
    stair: string;
}

export var setTextByPoint: (year: number, source: Source, index: number) => void
    = (year: number, source: Source, index: number) => {};

export var importSentence: (content: string, stair: string) => void
    = (content: string, stair: string) => {};


class Textbox extends Component<TextboxProps, TextboxState, any> {
    public binder: TextBinder;

    public constructor(props: TextboxProps) {
        super(props);
        this.state = {
            content: 'undefined',
            stair: 'undefined'
        };
        this.binder = new TextBinder(this, this.props.setText);
    }

    public render(): JSX.Element {
        return (
            <div id={this.props.id} style={{width: '100%'}}>
                <p style={{color: 'steelblue', fontSize: '24px'}}>意见：{this.state.content}</p>
                <br />
                {/* <p style={{color: 'steelblue', fontSize: '24px'}}>社会层面：{this.state.stair}</p> */}
            </div>
        );
    }

    public display(text: string, stair: string): void {
        this.setState({
            content: text,
            stair: stair
        });
    }
}

class TextBinder {
    private readonly space: Textbox;

    public constructor(space: Textbox,
            setText: ((year: number, source: Source, index: number) => void) | ((content: string, stair: string) => void)) {
        this.space = space;
        if (setText === setTextByPoint) {
            setTextByPoint = (year: number, source: Source, index: number) => {
                $.getJSON(`/data/origin$${year}@${source===Source.市建委?'sjw':'sjyj'}.json`, data => {
                    this.space.display(data[index], '?');
                });
            };
        }
        else if (setText === importSentence) {
            importSentence = (content: string, stair: string) => {
                this.space.display(content, stair);
            };
        }
    }
}


export default Textbox;
