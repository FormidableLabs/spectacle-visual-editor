import React from 'react';
import { Accordion } from '../components';

export default {
  title: 'Components/Accordion',
  component: Accordion
};

export const Primary = () => {
  return (
    <>
      <Accordion label="Section One">
        <div>Hello There</div>
      </Accordion>
      <Accordion label="Section Two">
        <button>Click Me</button>
      </Accordion>
    </>
  );
};
