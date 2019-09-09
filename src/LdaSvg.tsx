import React, { Component } from 'react';
import './bootstrap.css';
import './style.css';
import $ from 'jquery';

export enum Source {
    市教育局, 市建委
}

export interface LdaSvgProps {}

export interface LdaSvgState {
    data: Array<{ x: number, y: number, stack: number }>;
    groups: number;
    source: Source | null;
}

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
                                        cx={30} cy={(21 * Math.sqrt(20 / this.state.groups)) * index + 24}
                                        r={8 * Math.sqrt(20 / this.state.groups)}
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
                                            // TODO: a.js Line 4978
                                        }}
                                    />
                                    <text
                                        key={`lda_label_${index}`}
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        id={`lda_icon_${index}`} className={`lda_stack_label`}
                                        x={44} y={(21 * Math.sqrt(20 / this.state.groups)) * index + 24}
                                        textAnchor={'left'} dy={'0.4em'}
                                        style={{
                                            fontSize: 13 * Math.sqrt(20 / this.state.groups),
                                            fill: 'dark'
                                        }}
                                    >
                                        {`主题 ${index}`}
                                    </text>
                                </g>
                        )
                    })
                }
                {
                    this.state.data.map((item, index) => {
                        return (
                            <circle
                                key={`lda_point_${index}`}
                                xmlns={`http://www.w3.org/2000/svg`}
                                id={`lda_point_${index}`} className={`lda_stack_${item.stack}`}
                                cx={this.fx(item.x)} cy={this.fy(item.y)} r={6}
                                style={{
                                    opacity: 0.6,
                                    fill: this.colortap[item.stack % this.colortap.length],
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
                                    // var id = d[2].substring(2);
                                    // if (m == 1) {
                                    //     cloud(sjyjMAX, id, sjyjCloud);
                                    //     show(sjyjd, id);
                                    //     show2(0, id);
                                    //     emotion(sjyje, id);
                                    // } else if (m == 2) {
                                    //     cloud(sjwMAX, id, sjwCloud);
                                    //     show(sjwd, id);
                                    //     show2(0, id);
                                    //     emotion(sjwe, id);
                                    // }
                                }}
                            />
                        );
                    })
                }
            </svg>
        );
    }

    public componentDidMount(): void {
        $.getJSON('./data/2018sjyjk.json', (data: Array< {"0": number, "1": number, "k": number} >) => {
            let set: Array<{ x: number, y: number, stack: number }> = [];
            data.forEach(d => {
                set.push({
                    x: d["0"],
                    y: d["1"],
                    stack: d["k"]
                });
            });
            this.setState({
                data: set,
                groups: 20,
                source: Source.市教育局
            });
        });
    }
}

export default LdaSvg;
