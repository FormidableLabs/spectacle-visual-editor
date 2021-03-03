import React, { useState } from 'react';
import { InspectorContainer } from './inspector-styles';
import { Tab, Tablist } from 'evergreen-ui';
import { FormatInspector } from './format-inspector';
import { DocumentInspector } from './document-inspector';

const tabs = ['Document', 'Format', 'Layout'];

export const Inspector = () => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <InspectorContainer>
      <div>
        <Tablist margin={5} flexBasis={300}>
          {tabs.map((tab, index) => (
            <Tab
              key={tab}
              id={tab}
              onSelect={() => setTabIndex(index)}
              isSelected={index === tabIndex}
              aria-controls={`panel-${tab}`}
            >
              {tab}
            </Tab>
          ))}
        </Tablist>
      </div>
      {tabIndex === 0 && <DocumentInspector />}
      {tabIndex === 1 && <FormatInspector />}
    </InspectorContainer>
  );
};
