/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 13:36:37 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-17 11:58:41
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';


export interface EmotionAllProps {}

export interface EmotionAllState {
    data: Array<number>;
}

export var importAsEmotionAll: (filedata: Array< Array<number> >) => void = (filedata: Array< Array<number> >) => void 0;

class EmotionAll extends Component<EmotionAllProps, EmotionAllState, any> {
    private colortap: Array<string> = ["#FFB6C1", "#DC143C", "#A0522D", "#FF1493", "#FF00FF", "#800080", "#4B0082",
        "#7B68EE", "#0000FF", "#000080", "#6495ED", "#778899", "#00BFFF", "#B0E0E6", "#00FFFF", "#2F4F4F", "#00FA9A",
        "#006400", "#FFFF00", "#FF8C00"];

    public constructor(props: EmotionAllProps) {
        super(props);
        this.state = {
            data: []
        };
    }

    public render(): JSX.Element {
        let step: number = 380 / this.state.data.length;
        let max: number = 0.1;
        this.state.data.forEach(d => {
            if (d > max) {
                max = d;
            }
        });
        return (
            <svg width={420} height={230} id={'EmotionAll'} xmlns={`http://www.w3.org/2000/svg`}>
                {
                    this.state.data.map((item, index) => {
                        return (
                            <rect xmlns={`http://www.w3.org/2000/svg`} key={`topic_distri_${index}`}
                                x = { 20 + index * step + 0.18 * step } y = { 186 - item * 150 / max }
                                width = { step * 0.64 } height = { item * 150 / max }
                                style = {{
                                    fill: this.colortap[index % 20],
                                    stroke: 'black'
                                }}
                            />
                        )
                    })
                }
                {
                    this.state.data.map((item, index) => {
                        return (
                            <text xmlns={`http://www.w3.org/2000/svg`} key={`topic_distri_label_${index}`}
                                x = { 20 + index * step + 0.52 * step } y = { 203 }
                                textAnchor = { 'middle' }
                                style = {{
                                    fill: 'black',
                                    fontSize: Math.sqrt(step * 36) / 3.4
                                }}
                            >
                                { `${ index + 2016 }` }
                            </text>
                        )
                    })
                }
                {
                    this.state.data.map((item, index) => {
                        return (
                            <text xmlns={`http://www.w3.org/2000/svg`} key={`topic_distri_value_${index}`}
                                x = { 20 + index * step + 0.52 * step } y = { 180 - item * 150 / max }
                                textAnchor = { 'middle' }
                                style = {{
                                    fill: 'black',
                                    fontSize: Math.sqrt(step * 36) / 3.6
                                }}
                            >
                                { `${ parseInt((item * 1000).toString()) / 1000 }` }
                            </text>
                        )
                    })
                }
            </svg>
        );
    }

    public import(filedata: Array< Array<number> >): void {
        let set: Array<number> = [];
        filedata.forEach(e => {
            let sum: number = 0;
            e.forEach(d => {
                sum += d;
            });
            set.push(sum / e.length);
        });
        this.setState({
            data: set
        });
    }

    public componentDidMount(): void {
        importAsEmotionAll = this.import.bind(this);
    }
}


export default EmotionAll;
