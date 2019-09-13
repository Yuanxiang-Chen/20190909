/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:02 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-12 18:51:40
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';
import $ from 'jquery';
import { ldaData } from './Distribution';

export interface CloudProps {}

export interface CloudState {
    words: Array<{word: string, value: number}>
}

export var CloudRefresh: () => void = () => void 0;

export var loadCloud: (filedata: ldaData) => void = (filedata: ldaData) => void 0;
export var drawCloud: (topic: number) => void = (topic: number) => void 0;


class Cloud extends Component<CloudProps, CloudState, any> {
    private colortap: Array<string> = ["#FFB6C1", "#DC143C", "#A0522D", "#FF1493", "#FF00FF", "#800080", "#4B0082",
        "#7B68EE", "#0000FF", "#000080", "#6495ED", "#778899", "#00BFFF", "#B0E0E6", "#00FFFF", "#2F4F4F", "#00FA9A",
        "#006400", "#FFFF00", "#FF8C00"];

    public constructor(props: CloudProps) {
        super(props);
        this.state = { words: [] };
    }

    public render(): JSX.Element {
        let maxvalue: number = 0;
        this.state.words.forEach(d => {
            if (d.value > maxvalue) {
                maxvalue = d.value;
            }
        });
        let words: Array<{word: string, value: number}> = this.state.words;
        words.sort((a, b) => {
            return a.value - b.value;
        });
        return (
            <svg width={420} height={230} id={'wordcloud'} xmlns={`http://www.w3.org/2000/svg`}
            style={{position: 'relative', top: '-20px'}}>
                {
                    words.map((item, index) => {
                        let size: number = item.value / maxvalue * 16 + 20;
                        let width: number = 408 - size * item.word.length * 1.1;
                        let height: number = 218 - size * 1.3;
                        let _x: number = Math.random() * width + size * item.word.length * 0.55 + 6;
                        let _y: number = Math.random() * height + size * 0.65 + 6;
                        if (index !== 0 && Math.sqrt(Math.pow(_x - 210, 2) + Math.pow(_y - 115, 2)) < Math.sqrt(index) * 10) {
                            _x = _x < 210 ? _x - index * 100 : _x + index * 100;
                            _y = _y < 115 ? _y - index * 24 : _y + index * 24;
                        }
                        return (
                            <text key={index} className={'cloud_word'}
                                xmlns={`http://www.w3.org/2000/svg`}
                                x={ _x } y={ _y }
                                textAnchor={'middle'}
                                style={{
                                    fill: this.colortap[index % 20],
                                    fontSize: size
                                }}
                                >
                                { item.word }
                            </text>
                        )
                    })
                }
            </svg>
        );
    }

    private words: Array< Array<{word: string, value: number}> > = [];

    public draw(topic: number): void {
        if (this.words.length < topic) {
            return;
        }
        this.setState({
            words: this.words[topic]
        });
    }

    public componentDidMount(): void {
        $('*').keydown(function(event){
            if (event.which === 82) {
                CloudRefresh();
            }
        });
        CloudRefresh = () => {
            this.setState({
                words: this.state.words
            });
        };
        loadCloud = (filedata: ldaData) => {
            let data: Array<{topic: number, words: Array<{word: string, value: number}>}> = filedata['topics'];
            data.forEach(topic => {
                this.words.push(topic.words);
            });
        };
        drawCloud = this.draw.bind(this);
    }
}


export default Cloud;
