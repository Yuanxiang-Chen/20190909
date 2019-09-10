/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-10 10:38:15 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-10 17:31:38
 */
import React, { ChangeEvent } from 'react';
import './bootstrap.css';
import './style.css';
import Textbox from './textbox';
import Selector from './Selector';
import LdaSvg, { Source } from './LdaSvg';
import EmotionBar from './EmotionBar';
import Cloud, {CloudRefresh} from './Cloud';
import Distribution from './Distribution';
import $ from 'jquery';


let changeSelect: (event: ChangeEvent<HTMLSelectElement>) => void
    = event => {};

export var run: (year: number, source: Source, topic_amount: number) => void
    = (year: number, source: Source, topic_amount: number) => {
        let p: Promise<{}>
            = new Promise<{}>((resolve: (value?: {} | PromiseLike<{}> | undefined) => void, reject: (reason?: any) => void) => {
                // 发送异步请求
                $.ajax({
                    type: "POST",
                    url: "/Python/Lda.py",
                    data: {year, source, topic_amount},
                    dataType: "json",
                    success: data => {
                        resolve(data);
                    },
                    error: msg => {
                        reject(msg);
                    }
                });
            });
        p.then((value: {}) => {
            console.log("then()", value);
        }).catch((reason: any) => {
            console.error(reason);
        });
    };

run(2018, Source.市建委, 5);

const App: React.FC = () => {
  return (
    <>
      <div id="left">
          <div id="dataselect">
              <div className="panell-heading">
                  dataselect
              </div>
              <div >
                  <h1 style={{fontSize: '18px', marginLeft: '9px'}}>
                      相关建议的LDA结果与情感分析
                  </h1>
              </div>
              <div>
                  <select id="Year" style={{width: '50px', marginLeft: '10px', marginTop: '0px'}}>
                          <option value="0">选择数据</option>
                          <option value="1" id="year2016">2016</option>
                          <option value="2" id="year2017">2017</option>
                          <option value="3" id="year2018">2018</option>
                  </select>
                  <select id="project" onChange={changeSelect} style={{width: '50px', marginLeft: '10px', marginTop: '0px'}}>
                      <option value="0">选择数据</option>
                      <option value="1" id="1">市教育局</option>
                      <option value="2" id="2">市建委</option>
                  </select>
                  <Selector id="area" marginTop='0px' />
                  <Selector id="cs" marginTop='10px' />
                  <br />
                    &nbsp;&nbsp;&nbsp;Topic:<input className="endTime" type="text" id='etime'
                      style={{marginLeft: '9px', width: '100px', marginTop: '5px'}} />
                  <input type="button" value="TEST" id='btn' style={{width: '75px'}} />
              </div>

              <div id="sent"></div>
          </div>
          <div id="select">
              <div className="panell-heading">
                  Opinion1
              </div>
              <Textbox id='cloud'/>
          </div>
          <div id="text">
              <div className="panell-heading">
                  Opinion2
              </div>
              <Textbox id='cloud2'/>
          </div>
      </div>

      <div id="LDA">
          <div className="panell-heading">
              LDA
              <LdaSvg />
          </div>
      </div>
      <div id="emotion1">
          <div className="panell-heading">
              Emotion
          </div>
          <div id="Emo1" style={{height: '90px', width: '1259px'}}>
              <EmotionBar />
          </div>
      </div>
      <div id="topic">
          <div className="panell-heading">
              KeyWordCloud
          </div>
          <div id="cloud1" style={{height: '230px', width: '420px'}}>
              <button type="button" style={{position: 'relative', padding: '0px 5px', top: '-27px', left: '386px'}}
                    onClick={event => {CloudRefresh()}}>
                R
              </button>
              <Cloud />
          </div>
      </div>
      <div id="emotion">
          <div className="panell-heading">
              All
          </div>
          <div id="Emo" style={{height: '230px', width: '420px'}}>
              <Distribution />
          </div>
      </div>
      <div id="extra">
        <div className="panell-heading">
            Extra
        </div>
        <div id="extraDiv" style={{height: '230px', width: '420px'}}></div>
      </div>
    </>
  );
}

export default App;
