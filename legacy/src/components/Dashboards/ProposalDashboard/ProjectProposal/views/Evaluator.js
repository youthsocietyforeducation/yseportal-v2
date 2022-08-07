import React from 'react'; 
import { Steps, Button } from 'element-react'; 


export default class Evaluator extends React.Component {
    constructor(props) {
        super(props);
      
        this.state = {
          active: 0,
          steps: this.props.steps || [],
        };
      }

      componentDidMount = () => {
          const { steps } = this.props; 
          if (steps) {
              this.setState({
                  steps: steps 
              })
          }
      }

      renderSteps = (steps) => {
          if (steps) {
            return (
                steps.map((step, index) => {
                    return <Steps.Step key={index} title={step.title} description={step.description}></Steps.Step>
                })
            )
          } else {
              return <></>
          }
      }

      next = () => {
        const {next, steps, active, done }  = this.props; 
        next(); 
        if (steps[active] && steps[active].nextButtonFunction) {
          steps[active].nextButtonFunction(); 
        }
        if (done && active === steps.length ) {
          done();
        }
        // if(steps[active] && steps[active].done)
      }

      render() {
        const { steps, active, nextButtonsDisabled } = this.props; 
        console.log("Evaluator", steps); 
        console.log("Evaluator props", this.props); 
        const validStep = active < steps.length; 
        console.log("render active", active)
        return (
          <div>
            <div className="row">
                <div className="col-sm-6">
                    <div>{ validStep && steps[active].actions ? steps[active].actions() : <></>}</div>
                    <div>{ validStep && steps[active].confirm ? steps[active].confirm() : <></> } </div>
                </div>
                <div className="col-sm-6">
                    <Button disabled={ validStep && nextButtonsDisabled[active] }
                      className="btn-block" 
                      type={validStep && steps[active].buttonType || "default"} 
                      onClick={this.next}>{validStep && steps[active].buttonTitle || "Done" }</Button>
                    <Steps className="mt-3" direction={this.props.direction} 
                      active={active} finishStatus="success" processStatus={"finish"}>
                        { this.renderSteps(steps) }
                    </Steps>
                </div>
            </div>
          </div>
        )
      }
}