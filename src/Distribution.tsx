/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 13:36:37 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-13 14:47:20
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';


export interface ldaData {
    topics: Array<{topic: number, words: Array<{word: string, value: number}>}>;
    distributions: Array< Array<{stack: number, value: number}> >;
}

export interface DistributionProps {}

export interface DistributionState {
    data: Array<number>;
}

export var importAsDistribution: (filedata: ldaData) => void = (filedata: ldaData) => void 0;

class Distribution extends Component<DistributionProps, DistributionState, any> {
    private colortap: Array<string> = ["#FFB6C1", "#DC143C", "#A0522D", "#FF1493", "#FF00FF", "#800080", "#4B0082",
        "#7B68EE", "#0000FF", "#000080", "#6495ED", "#778899", "#00BFFF", "#B0E0E6", "#00FFFF", "#2F4F4F", "#00FA9A",
        "#006400", "#FFFF00", "#FF8C00"];

    public constructor(props: DistributionProps) {
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
            <svg width={420} height={230} id={'distribution'} xmlns={`http://www.w3.org/2000/svg`}>
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
                                { `主题${ index + 1 }` }
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
                                { `${ parseInt((item * 10000).toString()) / 100 }%` }
                            </text>
                        )
                    })
                }
            </svg>
        );
    }

    public import(filedata: ldaData): void {
        let data: Array<number> = [];
        let groups: number = filedata.distributions[0].length;
        for (let i: number = 0; i < groups; i++) {
            data.push(0);
        }
        filedata.distributions.forEach(line => {
            line.forEach(d => {
                data[d.stack] += d.value;
            });
        });
        for (let i: number = 0; i < data.length; i++) {
            data[i] /= filedata.distributions.length;
        }
        this.setState({
            data: data
        });
    }

    public componentDidMount(): void {
        importAsDistribution = this.import.bind(this);
    }
}


export default Distribution;
