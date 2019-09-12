/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:02 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-12 14:05:30
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';
import $ from 'jquery';
import { ldaData } from './Distribution';

export interface CloudProps {}

export interface CloudState {
    words: Array<{text: string, value: number}>
}

export var CloudRefresh: () => void = () => void 0;

export var loadCloud: (filedata: ldaData) => void = (filedata: ldaData) => void 0;


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
        let words: Array<{text: string, value: number}> = this.state.words;
        words.sort((a, b) => {
            return a.value - b.value;
        });
        return (
            <svg width={420} height={230} id={'wordcloud'} xmlns={`http://www.w3.org/2000/svg`}
            style={{position: 'relative', top: '-20px'}}>
                {
                    words.map((item, index) => {
                        let size: number = item.value / maxvalue * 16 + 20;
                        let width: number = 408 - size * item.text.length * 1.1;
                        let height: number = 218 - size * 1.3;
                        let _x: number = Math.random() * width + size * item.text.length * 0.55 + 6;
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
                                { item.text }
                            </text>
                        )
                    })
                }
            </svg>
        );
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
            let box: Array<{word: string, value: number}> = [];
            let max: number = 0;
            let min: number = 1;
            data.forEach(topic => {
                let _use: {word: string, value: number} | null = null;
                topic.words.forEach(word => {
                    if (!_use || (word.value > _use!.value && word.word.length > 1)) {
                        _use = word;
                    }
                });
                box.push(_use ? _use : {word: "?", value: 0});
            });
            box.forEach(d => {
                if (d.value > max) {
                    max = d.value;
                }
                if (d.value < min) {
                    min = d.value;
                }
            });
            for (let i: number = 0; i < box.length; i++) {
                box[i] = {word: box[i].word, value: (box[i].value - min) / (max - min)};
            };
        };
        this.setState({
            words: [
                { text: '关键词', value: 1024 },
                { text: '内容', value: 628 },
                { text: '主题', value: 800 },
                { text: '热词', value: 750 },
                { text: '干扰词', value: 500 },
                { text: '常用字', value: 800 },
                { text: '专有名词', value: 470 },
                { text: '细节', value: 10 },
                { text: '值得关注的内容', value: 640 },
                { text: '某个经常出现的字符串', value: 440 }
            ]
        });
    }
}


export default Cloud;
