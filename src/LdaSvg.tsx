/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:37 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-15 13:19:05
 */
import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';
import $ from 'jquery';
import { ldaData } from './Distribution';
import { drawCloud } from './Cloud';
import { setTextByPoint } from './textbox';

export enum Source {
    市教育局, 市建委
}

export interface CorData {
    data: Array< Array<number> >;
}

export interface LdaSvgProps {}

export interface LdaSvgState {
    data: Array<{ x: number, y: number, stack: number }>;
    groups: number;
    source: Source | null;
}

export var setCor: (ldadata: ldaData, tsnedata: CorData, source: Source, topic_amount: number) => void
    = (ldadata: ldaData, tsnedata: CorData, source: Source, topic_amount: number) => void 0;

class LdaSvg extends Component<LdaSvgProps, LdaSvgState, any> {
    private colortap: Array<string> = ["#FFB6C1", "#DC143C", "#A0522D", "#FF1493", "#FF00FF", "#800080", "#4B0082",
        "#7B68EE", "#0000FF", "#000080", "#6495ED", "#778899", "#00BFFF", "#B0E0E6", "#00FFFF", "#2F4F4F", "#00FA9A",
        "#006400", "#FFFF00", "#FF8C00"];

    public constructor(props: LdaSvgProps) {
        super(props);
        this.state = {
            data: [],
            groups: 20,
            source: null
        };
    }

    private fx: (data: number) => number
        = () => {
            return 40;
        }

    private fy: (data: number) => number
        = () => {
            return 0;
        }

    private updateScale(): void {
        if (this.state.data.length === 0) {
            return;
        }
        let xmin: number = this.state.data[0].x;
        let xmax: number = this.state.data[0].x;
        let ymin: number = this.state.data[0].y;
        let ymax: number = this.state.data[0].y;
        this.state.data.forEach(d => {
            if (d.x < xmin) {
                xmin = d.x;
            }
            if (d.x > xmax) {
                xmax = d.x;
            }
            if (d.y < ymin) {
                ymin = d.y;
            }
            if (d.y > ymax) {
                ymax = d.y;
            }
        });
        this.fx = (data: number) => (data * 0.8 - xmin) / (xmax - xmin) * 1206 + 40;
        this.fy = (data: number) => (data * 0.9 - ymin) / (ymax - ymin) * 450;
    }

    public render(): JSX.Element {
        this.updateScale();
        if (this.state.groups === 0 || this.state.data.length === 0) {
            return (<></>);
        }
        return (
            <svg width={1256} transform={'translate(0, 6)'} height={450} id={'tsne'} xmlns={`http://www.w3.org/2000/svg`}>
                {
                    this.colortap.map((item, index) => {
                        return (
                            index >= this.state.groups
                                ? <g key={`lda_g_${index}`}></g>
                                : <g key={`lda_g_${index}`}>
                                    <circle
                                        key={`lda_icon_${index}`}
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        id={`lda_icon_${index}`} className={`lda_stack_icon`}
                                        cx={30} cy={(21 * 20 / this.state.groups) * index + 24}
                                        r={8 * Math.log(24 / this.state.groups) + 4}
                                        style={{
                                            fill: item
                                        }}
                                        onClick={() => {
                                            $(`.lda_stack_${index}`).animate({
                                                r: 15
                                            }, 200, () => {
                                                setTimeout(() => {
                                                    $(`.lda_stack_${index}`).animate({
                                                        r: 6
                                                    }, 600, void 0)
                                                }, 200);
                                            });
                                            drawCloud(index);
                                        }}
                                    />
                                    <text
                                        key={`lda_label_${index}`}
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        id={`lda_icon_${index}`} className={`lda_stack_label`}
                                        x={44} y={(21 * 20 / this.state.groups) * index + 24}
                                        textAnchor={'start'} dy={'0.4em'}
                                        style={{
                                            fontSize: 13 * Math.log(24 / this.state.groups) + 2,
                                            fill: 'dark'
                                        }}
                                    >
                                        {`主题 ${ index + 1 }`}
                                    </text>
                                </g>
                        )
                    })
                }
                {
                    this.state.data.map((item, index) => {
                        let color: string = this.colortap[item.stack % this.colortap.length];
                        let _r: string = (0x100 - parseInt(color.substring(1, 3), 16)).toString(16);
                        let _g: string = (0x100 - parseInt(color.substring(3, 5), 16)).toString(16);
                        let _b: string = (0x100 - parseInt(color.substring(5, 7), 16)).toString(16);
                        return (
                            <circle
                                key={`lda_point_${index}`}
                                xmlns={`http://www.w3.org/2000/svg`}
                                id={`lda_point_${index}`} className={`lda_stack_${item.stack}`}
                                cx={this.fx(item.x)} cy={this.fy(item.y)} r={6}
                                style={{
                                    opacity: 0.6,
                                    fill: color,
                                    stroke: `#${_r}${_g}${_b}99`,
                                    strokeWidth: 1
                                }}
                                onMouseOver={() => {
                                    // d3.select(this).attr("r", 10).attr("opacity", "0.8");
                                    // tooltip.html(d[2]);
                                    // tooltip.style("visibility", "visible");
                                }}
                                onMouseMove={() => {
                                    // tooltip.style('top', (parseInt(d3.event.pageY) - 10) + 'px')
                                    //      .style('left', (parseInt(d3.event.pageX) + 10) + 'px');
                                }}
                                onMouseOut={() => {
                                    // d3.select(this)
                                    //     .transition()
                                    //     .duration(500)
                                    //     .attr("r", 6)
                                    //     .attr("opacity", "0.6");
                                    // tooltip.style("visibility", "hidden");
                                }}
                                onClick={() => {
                                    setTextByPoint(
                                        parseInt($('#Year').val()!.toString()) + 2015,
                                        parseInt($('#project').val()!.toString()) === 1 ? Source.市教育局 : Source.市建委,
                                        index
                                    );
                                    drawCloud(item.stack);
                                }}
                            />
                        );
                    })
                }
            </svg>
        );
    }

    public importCoordinate(ldadata: ldaData, tsnedata: CorData, source: Source, topic_amount: number): void {
        let cors: Array<{ x: number, y: number, stack: number }> = [];
        for (let i: number = 0; i < tsnedata.data.length && i < ldadata.distributions.length; i++) {
            let max: number = 0;
            let stack: number = 0;
            ldadata.distributions[i].forEach(d => {
                if (d.value > max) {
                    max = d.value;
                    stack = d.stack;
                }
            });
            cors.push({
                x: tsnedata.data[i][0],
                y: tsnedata.data[i][1],
                stack: stack
            });
        }
        this.setState({
            data: cors,
            source: source,
            groups: topic_amount
        });
    }

    public componentDidMount(): void {
        setCor = this.importCoordinate.bind(this);
    }
}

export default LdaSvg;
