import React, { Component } from 'react';
import $ from 'jquery';
import './bootstrap.css';
import './style.css';
import { importSentence } from './textbox';


export interface ListBoxProps {}

export interface ListBoxState{
    document: Array<string>;
}

export var fitWord: (word: string) => void
    = (word: string) => {};

class ListBox extends Component<ListBoxProps, ListBoxState, any> {
    public constructor(props: ListBoxProps){
        super(props);
        this.state = {
            document:[]
        };
    }

    public render(): JSX.Element{
        return (
            <>
                {   
                    this.state.document.map((item, index) => {
                        return (
                            <p key={index}
                                style={{
                                    lineHeight: 1.8,
                                    borderBottom: '1px solid black',
                                    margin: '0px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px'
                                }}
                                onClick={
                                    () => { importSentence(item, '?'); }
                                }>
                                { `意见${ index + 1 }${ index < 9 ? ' ' : '' }："${ index < 99
                                    ? item.length >= 11 ? item.substring(0, 9) + '...' : item
                                    : item.length >= 10 ? item.substring(0, 8) + '...' : item}"` }
                            </p>
                        )
                    })
                }
            </>
        )
    }

    public componentDidMount(): void {
        fitWord = (word: string) => {
            $.getJSON(`/data/origin$${parseInt($('#Year').val()!.toString())+2015}`
                    + `@${parseInt($('#project').val()!.toString())===1?'sjyj':'sjw'}.json`, (data: Array<string>) => {
                let list: Array<string> = [];
                data.forEach((d: string) => {
                    if (d.includes(word)) {
                        list.push(d);
                    }
                });
                this.setState({
                    document: list
                });
            });
        }
    }
}


export default ListBox;
