import React, { Component } from "react";
import axios from 'axios';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const validation = ({ error, ...rest }) => {
    let checkValidation = true;

    Object.values(error).forEach(val => {
        if (val.length > 0) {
            checkValidation = false
        } 
    });

    Object.values(rest).forEach(val => {
        if (val === null) {
            checkValidation = false
        }
    });
     
    return checkValidation;
    
};



export default class Form extends Component {


    constructor(props) {
        super(props)

        this.state = this.getInitialState();
    }
    getInitialState=()=>({
            error: {
                number: ''
            },
            rss:{
                food:0,
                wood:0,
                stone:0,
                iron:0,
                silver:0,
                steel:0
                
            },
            misc:{
                time:0,
                might:0,
                score:0,
                speedups:0,
                optimizeMsg:''
            },
            selectedTrainSpeedup:'8',
            selectedOptimizeSpeedup:'8',
            selectedOptimizeTroop:'t1melee',
            showForm:true
        })
    getFormInputs = () => {
        let content = [];
        for (let i = 35; i >= 1; i--) {
            var named="level"+i;
          content.push(
              <div className="form-group mb-3 col-4">
                  <label className="mb-2"><strong>Level {i}</strong></label>
                  <input
                      type="number"
                      name={named}
                      className="form-control" 
                      onChange={this.formObject}/>
              </div>
          );
        }
        return content;
      };
    onFormReset = event=>{
        event.preventDefault();
        event.target.form.reset();
        var intstate=this.getInitialState();
        var keysold= Object.keys(intstate);
        var keysnew = Object.keys(this.state);
        var showForm=this.state.showForm;
        keysnew = keysnew.filter(val => !keysold.includes(val));
        const stateReset = keysnew.reduce((acc, v) => ({ ...acc, [v]: 0 }), {});
        this.setState({...stateReset,...intstate,showForm});
    }
    onOptFormSubmit = event => {
        event.preventDefault();
        var self = this;
        if (validation(this.state)) {
            var formData=this.state;
            axios.post('https://ultimatemoecalcserver.onrender.com/optimize', formData,{headers:{"Content-Type" : "application/json"}})
        .then(function (response) {
           if(response.status===200){
            self.setState(response.data);
           }

        })
        .catch(function (error) {
          console.log(error);
        });
            window.scrollTo(0, 1000);
            
        } else {
            console.log("Error occured");
        }
        
        
    };
    onFormSubmit = event => {
        event.preventDefault();
        var self = this;
        if (validation(this.state)) {
            var formData=this.state;
            axios.post('https://ultimatemoecalcserver.onrender.com/calculate', formData,{headers:{"Content-Type" : "application/json"}})
        .then(function (response) {
           if(response.status===200){
            self.setState(response.data);
           }

        })
        .catch(function (error) {
          console.log(error);
        });
            window.scrollTo(0, 1000);
            
        } else {
            console.log("Error occured");
        }
        
        
    };
    handleTrainSpeedupChange = changeEvent=> {
        var time=Number(this.state.misc.time);
        var type=Number(changeEvent.target.value);
        var speedup=Math.ceil(time/type);
        this.setState({
          selectedTrainSpeedup: changeEvent.target.value,
          misc:{
            ...this.state.misc,
            speedups:speedup
          }
        });
      }
      handleOptimizeSpeedupChange = changeEvent=> {
        this.setState({
          selectedOptimizeSpeedup: changeEvent.target.value
        });
      }
      handleOptimizeTroopChange = changeEvent=> {
        this.setState({
          selectedOptimizeTroop: changeEvent.target.value
        });
      }
      
    formSwitch = event =>{
        event.preventDefault();
        this.onFormReset(event);
       if(this.state.showForm){
        this.setState({showForm:false})
       }
       else{
        this.setState({showForm:true})
       }
    }
    formObject = event => {

        event.preventDefault();

        const { name,type, value } = event.target;
        let error = {...this.state.error };

        switch (type) {
            case "number":
                if(value<0){
                event.target.className="is-invalid form-control" ;
                if(!event.target.nextSibling){
                var txt=document.createElement("span");
                txt.innerHTML="Amount is not valid"
                txt.className="invalid-feedback";
                event.target.parentNode.insertBefore(txt,event.target.nextSibling);
                }
                error.number="Amount is negative";
                }
                else if(name==="royalbarrack" && (value>35 || value<=0)){
                    event.target.className="is-invalid form-control" ;
                if(!event.target.nextSibling){
                var txtt=document.createElement("span");
                txtt.innerHTML="Level not valid."
                txtt.className="invalid-feedback";
                event.target.parentNode.insertBefore(txtt,event.target.nextSibling);
                }
                error.number="Amount is not valid";
            }
                else{
                    event.target.className="form-control" ;
                    error.number="";
                }
                break;
            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
        
    };
     

    render() {
        return (
            <div className="container-xxl">
                <div class="h1 text-center">March of Empires Calculator</div>
                {this.state.showForm?
                <div id="trainingcalc">
                <form>
                    <div class="row">
                        <div class="col-4">
                            <div class="card">
                                <div class="card-body">
                                    <div class="h4">T1 Troops (in M)</div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Swordsmen</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t1sword"
                                            className="form-control"
                                            onChange={this.formObject} />

                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Spearmen</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t1spear"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Mounted</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t1cav"
                                            className="form-control" onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Ranged</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t1range"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Siege</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t1siege"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                </div>
                            </div>
                            </div><div class="col-4">
                            <div class="card"><div class="card-body">
                                    <div class="h4">T5 Troops (in M)</div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Swordsmen</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t5sword"
                                            className="form-control"
                                            onChange={this.formObject} />

                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Spearmen</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t5spear"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Mounted</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t5cav"
                                            className="form-control" onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Ranged</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t5range"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Siege</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t5siege"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                </div></div>
                                </div><div class="col-4">
                            <div class="card"><div class="card-body">
                                    <div class="h4">T6 Troops (in M)</div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Swordsmen</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t6sword"
                                            className="form-control"
                                            onChange={this.formObject} />

                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Spearmen</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t6spear"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Mounted</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t6cav"
                                            className="form-control" onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Ranged</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t6range"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Siege</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="t6siege"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                </div></div>
                                </div>
                                
                                <div class="col mt-2">
                            <div class="card h-100"><div class="card-body">
                                    <div class="h4">Faction Troops (in M)</div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Type 1</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="faction1"
                                            className="form-control"
                                            onChange={this.formObject} />

                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Type 2</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="faction2"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                </div></div>
                                </div>
                                <div class="col mt-2">
                                <div class="card h-100"><div class="card-body">
                                    <div class="h4">Speed</div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Normal Training Speed</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="tspeed"
                                            className="form-control"
                                            onChange={this.formObject} />

                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2"><strong>Faction Training Speed</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="fspeed"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                </div></div>
                        </div>
                        </div>
                    
                    <div class="m-2">
                     <div class="row">
                        <div class="col-4">   
                    <button onClick={this.onFormSubmit} className="btn btn-block btn-secondary mx-2">Calculate</button>
                    </div>
                    <div class="col-4">
                    <button onClick={this.formSwitch} className="btn btn-block btn-secondary">Go to Optimize</button>
                    </div>
                    <div class="col-4">
                    <button onClick={this.onFormReset} className="btn btn-block btn-secondary float-end">Reset</button>
                    </div>
                    </div>
                    </div>
                </form>
                <div>
                    <div class="card">
                        <div class="card-body">
                            <div class="h4">Resources needed</div>
                            <div class="row row-cols-2">
                                <div class="col">Food<span id="food" class="float-end">{this.state.rss.food}</span></div>
                                <div class="col">Iron<span id="iron" class="float-end">{this.state.rss.iron}</span></div>
                                <div class="col">Wood<span id="wood" class="float-end">{this.state.rss.wood}</span></div>
                                <div class="col">Silver<span id="silver" class="float-end">{this.state.rss.silver}</span></div>
                                <div class="col">Stone<span id="stone" class="float-end">{this.state.rss.stone}</span></div>
                                <div class="col">Steel<span id="steel" class="float-end">{this.state.rss.steel}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="h4">Time for Completion</div>
                            <div>Total Time in hours : <span id="time">{this.state.misc.time}</span></div>
                            <div>Choose Speedup Type :</div>
                            <div class="form-check row">
                            <label class="form-check-label col-3" for="8hr">
                                <input class="form-check-input" type="radio" name="trainspeedups" id="8hrtrain" value="8"
                                checked={this.state.selectedTrainSpeedup ==='8'}
                                onChange={this.handleTrainSpeedupChange}
                                />
                                    8 Hours
                                </label>
                                <label class="form-check-label col-3" for="15hr">
                                <input class="form-check-input" type="radio" name="trainspeedups" id="15hrtrain" value="15" 
                                checked={this.state.selectedTrainSpeedup ==='15'}
                                onChange={this.handleTrainSpeedupChange}/>
                                
                                    15 Hours
                                </label>
                                <label class="form-check-label col-3" for="3day">
                                <input class="form-check-input" type="radio" name="trainspeedups" id="3day" value="72"
                                checked={this.state.selectedTrainSpeedup ==='72'}
                                onChange={this.handleTrainSpeedupChange}/>
                                    3 Days
                                </label>
                            </div>
                            <div>Speedups Required : <span id="speedupsneeded">{this.state.misc.speedups}</span></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="h4">Scores</div>
                            <div>Might Gained: {this.state.misc.might}</div>
                            <div>Event Score: {this.state.misc.score}</div>
                        </div>
                    </div>
                </div>
                </div>
                :
                <div id="optimizingcalc">
                <form onSubmit={this.onOptFormSubmit}>
                    {this.state.selectedOptimizeTroop.indexOf('fac')<0 &&
                    <div class="card">
                        <div class="card-body">
                            <div class="h4">Enter number of barracks</div>
                            <div class="row">
                            {this.getFormInputs()}
                            </div>
                        </div>
                    </div>}
                    <div class="card">
                        <div class="card-body">
                            <div class="h4">Enter current setup</div>
                            <div class="row">
                            <div className="form-group mb-3 col-6">
                                        <label className="mb-2"><strong>{this.state.selectedOptimizeTroop.indexOf('fac')>0?'Faction ':''}Training Speed{this.state.selectedOptimizeTroop.indexOf('fac')>0?' (Enter the percentage you see in player profile)':''}</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="trainspeed"
                                            className="form-control"
                                            onChange={this.formObject} />

                                    </div>
                                    <div className="form-group mb-3 col-6">
                                        <label className="mb-2"><strong>{this.state.selectedOptimizeTroop.indexOf('fac')>0?'Faction ':''}Training Capacity{this.state.selectedOptimizeTroop.indexOf('fac')>0?' (Enter the amount you see in royalbarracks)':''}</strong></label>
                                        <input
                                            
                                            type="number"
                                            name="tcapacity"
                                            className="form-control"
                                            onChange={this.formObject} />
                                    </div>
                                    </div>
                                <div>
                                <div>Choose Speedup Type :</div>
                            <div class="form-check row">
                            <label class="form-check-label col-3" for="8hr">
                                <input class="form-check-input" type="radio" name="optimizespeedups" id="8hroptimize" value="8"
                                checked={this.state.selectedOptimizeSpeedup ==='8'}
                                onChange={this.handleOptimizeSpeedupChange}
                                />
                                    8 Hours
                                </label>
                                <label class="form-check-label col-3" for="15hr">
                                <input class="form-check-input" type="radio" name="optimizespeedups" id="15hroptimize" value="15" 
                                checked={this.state.selectedOptimizeSpeedup ==='15'}
                                onChange={this.handleOptimizeSpeedupChange}/>
                                
                                    15 Hours
                                </label>
                                <label class="form-check-label col-3" for="3day">
                                <input class="form-check-input" type="radio" name="optimizespeedups" id="3dayoptimize" value="72"
                                checked={this.state.selectedOptimizeSpeedup ==='72'}
                                onChange={this.handleOptimizeSpeedupChange}/>
                                    3 Days
                                </label>
                            </div>
                                </div>
                                <div>
                                    <div>Choose troop you want to train:</div>
                                    <div class="form-check row">
                            <label class="form-check-label col-3" for="t1melee">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t1melee" value="t1melee"
                                checked={this.state.selectedOptimizeTroop ==='t1melee'}
                                onChange={this.handleOptimizeTroopChange}
                                />
                                    T1 Melee
                                </label>
                                <label class="form-check-label col-3" for="t1range">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t1range" value="t1range" 
                                checked={this.state.selectedOptimizeTroop ==='t1range'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    T1 Range
                                </label>
                                <label class="form-check-label col-3" for="t1siege">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t1siege" value="t1siege"
                                checked={this.state.selectedOptimizeTroop ==='t1siege'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    T1 Siege
                                </label>
                            </div>
                            <div class="form-check row">
                            <label class="form-check-label col-3" for="t5melee">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t5melee" value="t5melee"
                                checked={this.state.selectedOptimizeTroop ==='t5melee'}
                                onChange={this.handleOptimizeTroopChange}
                                />
                                    T5 Melee
                                </label>
                                <label class="form-check-label col-3" for="t5range">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t5range" value="t5range" 
                                checked={this.state.selectedOptimizeTroop ==='t5range'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    T5 Range
                                </label>
                                <label class="form-check-label col-3" for="t5siege">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t5siege" value="t5siege"
                                checked={this.state.selectedOptimizeTroop ==='t5siege'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    T5 Siege
                                </label>
                            </div>
                            <div class="form-check row">
                            <label class="form-check-label col-3" for="t6melee">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t6melee" value="t6melee"
                                checked={this.state.selectedOptimizeTroop ==='t6melee'}
                                onChange={this.handleOptimizeTroopChange}
                                />
                                    T6 Melee
                                </label>
                                <label class="form-check-label col-3" for="t6range">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t6range" value="t6range" 
                                checked={this.state.selectedOptimizeTroop ==='t6range'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    T6 Range
                                </label>
                                <label class="form-check-label col-3" for="t6siege">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="t6siege" value="t6siege"
                                checked={this.state.selectedOptimizeTroop ==='t6siege'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    T6 Siege
                                </label>
                            </div>
                            <div class="form-check row">
                            <label class="form-check-label col-3" for="f1fac">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="f1fac" value="f1fac"
                                checked={this.state.selectedOptimizeTroop ==='f1fac'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    Faction type 1
                                </label>
                                <label class="form-check-label col-3" for="f2fac">
                                <input class="form-check-input" type="radio" name="optimizetroops" id="f2fac" value="f2fac"
                                checked={this.state.selectedOptimizeTroop ==='f2fac'}
                                onChange={this.handleOptimizeTroopChange}/>
                                    Faction type 2
                                </label>
                                </div>
                                {this.state.selectedOptimizeTroop.indexOf('fac')>0 &&
                                <label class="form-check-label col-6">
                                     <input class="form-control" placeholder="Enter your Royal Barracks Level" type="number" name="royalbarrack"
                                onChange={this.formObject}/>
                                </label>}
                                
                                </div>
                        </div>
                    </div>
                    <div class="m-2">
                    <div class="row">
                        <div class="col-4">   
                    <button onClick={this.onOptFormSubmit} className="btn btn-block btn-secondary mx-2">Optimize</button>
                    </div>
                    <div class="col-4">
                    <button onClick={this.formSwitch} className="btn btn-block btn-secondary">Go to Calculate</button>
                    </div>
                    <div class="col-4">
                    <button onClick={this.onFormReset} className="btn btn-block btn-secondary float-end">Reset</button>
                    </div>
                    </div>
                    </div>
                </form>
                <div class="card">
                    <div class="card-body">
                        <div class="h4">Result</div>
                    <div>{this.state.misc.optimizeMsg}</div>
                    </div>
                </div>
                </div>}
            </div>
        );
    }
}
