import React from 'react'; 
import { Steps, Button } from 'element-react'; 


export default class ActivityItem extends React.Component {
    constructor(props) {
        super(props);
      
        this.state = {

        };
      }

      componentDidMount = () => {
          console.log("AST activities", this.props.activities)
        //   const { steps } = this.props; 
        //   console.log("activities ATS activities", this.props.activities)
        //   if (steps) {
        //       this.setState({
        //           steps: steps 
        //       })
        //   }
      }

      renderSteps = (steps) => {
          if (steps) {
            return (
                steps.map((step, index) => {
                    return <Steps.Step key={index} title={step.title || "title"} 
                    description={step.description || "description"}></Steps.Step>
                })
            )
          } else {
              return <></>
          }
      }

    //   next = () => {
    //     const {next, steps, active}  = this.props; 
    //     next(); 
    //     if (steps[active].nextButtonFunction) {
    //       steps[active].nextButtonFunction(); 
    //     }
    //   }

      render() {
        const { steps, active } = this.props; 
        return (
            <div className="text item">Activity Item</div>
        )
      }
}