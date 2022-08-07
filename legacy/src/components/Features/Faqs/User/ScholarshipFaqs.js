import React from 'react';
import FaqsBaseComponent from '../FaqsBaseComponent';
// items will be data fetch from firestore faqs collections
const items = [
    {
        id:"Question1 ID",
        header:"Voluptate velit laborum cupidatat est sunt commodo ut cupidatat consectetur tempor minim elit duis.",
        paragraph:"Ea id ad eu excepteur Lorem voluptate id. Dolor aute occaecat adipisicing exercitation anim commodo et reprehenderit laboris mollit proident id sit. Deserunt laboris quis dolor qui amet.",
    },
    {
        id:"Question2 ID",
        header:"Ullamco quis nulla duis et do occaecat incididunt laboris non fugiat.",
        paragraph:"Ea id ad eu excepteur Lorem voluptate id. Dolor aute occaecat adipisicing exercitation anim commodo et reprehenderit laboris mollit proident id sit. Deserunt laboris quis dolor qui amet."
    },
    {
        id:"Question3 ID",
        header:"Excepteur cillum nostrud eu ut labore.",
        paragraph:"Ea id ad eu excepteur Lorem voluptate id. Dolor aute occaecat adipisicing exercitation anim commodo et reprehenderit laboris mollit proident id sit. Deserunt laboris quis dolor qui amet."
    },
    {
        id:"Question4 ID",
        header:"Ipsum consequat elit veniam ipsum reprehenderit dolore ipsum nisi in veniam exercitation commodo irure ex.",
        paragraph:"Ea id ad eu excepteur Lorem voluptate id. Dolor aute occaecat adipisicing exercitation anim commodo et reprehenderit laboris mollit proident id sit. Deserunt laboris quis dolor qui amet."
    }
];

class ScholarshipFaqs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faqs:items,
    }
  }
  render() {
    return (
      <div style={{ marginTop: "0.5em" }}>
        <FaqsBaseComponent items={this.state.faqs} />
      </div>
    );
  }
}

export default ScholarshipFaqs;