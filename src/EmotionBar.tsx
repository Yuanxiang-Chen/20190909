/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:05 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-17 11:40:16
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';

export interface EmotionBarProps {}

export interface EmotionBarState {
    data: number | null
}

export var showValue: (value: number) => void
    = (value: number) => {};


class EmotionBar extends Component<EmotionBarProps, EmotionBarState, any> {
    public constructor(props: EmotionBarProps) {
        super(props);
        this.state = {
            data: null
        };
    }

    public render(): JSX.Element {
        if (this.state.data) {
            return (
                <svg width={1259} transform={'translate(0, 6)'} height={90} id={'centrebar'} xmlns={`http://www.w3.org/2000/svg`}>
                    <rect
                        xmlns={`http://www.w3.org/2000/svg`}
                        x={59} y={32} rx={10} ry={10} width={1159} height={18}
                        style={{
                            fill: '#ccc',
                            stroke: 'black'
                        }}
                    />
                    <rect
                        xmlns={`http://www.w3.org/2000/svg`}
                        x={59} y={32} rx={10} ry={10} width={1159 * this.state.data} height={18}
                        style={{
                            fill: this.state.data <= 0.35 ? 'red'
                                    : this.state.data <= 0.65 ? 'yellow'
                                        : 'steelblue',
                            stroke: 'none'
                        }}
                    />
                    <text
                        xmlns={`http://www.w3.org/2000/svg`}
                        x={1159 * this.state.data + 57} y={ 20 }
                        textAnchor={'middle'}
                        style={{
                            fill: 'black',
                            fontSize: 13
                        }}
                        >
                        { this.state.data }
                    </text>
                </svg>
            );
        }
        else {
            return (
                <svg width={1259} transform={'translate(0, 6)'} height={90} id={'centrebar'} xmlns={`http://www.w3.org/2000/svg`}>
                    <rect
                        xmlns={`http://www.w3.org/2000/svg`}
                        x={59} y={32} rx={10} ry={10} width={1159} height={18}
                        style={{
                            fill: '#ccc',
                            stroke: 'black'
                        }}
                    />
                </svg>
            );
        }
    }

    private import(value: number): void {
        this.setState({
            data: value
        });
    }

    public componentDidMount(): void {
        showValue = this.import.bind(this);
    }
}


export default EmotionBar;
