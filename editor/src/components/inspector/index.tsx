import React, { useState } from 'react';
import { InspectorContainer } from './inspector-styles';
import { Tab, Tablist } from 'evergreen-ui';
import { FormatInspector } from './format-inspector';
import { DocumentInspector } from './document-inspector';
import { InspectorTab, TabValuesList } from '../../types/inspector-tabs';
import {
  useSwitchToFormatInspectorOnElementSelected,
  useSwitchToLayoutInspectorOnSlideAdded
} from '../../hooks/inspector-hooks';

export const Inspector = () => {
  const [activeTab, setActiveTab] = useState(InspectorTab.Document);
  useSwitchToFormatInspectorOnElementSelected({ setActiveTab });
  useSwitchToLayoutInspectorOnSlideAdded({ setActiveTab });

  return (
    <InspectorContainer>
      <div>
        <Tablist margin={5} flexBasis={300}>
          {TabValuesList.map((tab) => (
            <Tab
              key={tab}
              id={tab}
              onSelect={() => setActiveTab(tab)}
              isSelected={tab === activeTab}
              aria-controls={`panel-${tab}`}
            >
              {tab}
            </Tab>
          ))}
        </Tablist>
      </div>
      {(() => {
        if (activeTab === InspectorTab.Document) {
          return <DocumentInspector />;
        } else if (activeTab === InspectorTab.Format) {
          return <FormatInspector />;
        }
      })()}
    </InspectorContainer>
  );
};
