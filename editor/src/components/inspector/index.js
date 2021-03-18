import React, { useState } from 'react';
import { InspectorContainer } from './inspector-styles';
import { Tab, Tablist } from 'evergreen-ui';
import { FormatInspector } from './format-inspector';
import { DocumentInspector } from './document-inspector';
import { useSelector } from 'react-redux';
import { selectedElementSelector } from '../../slices/deck-slice';

const TABS = {
  DOCUMENT: 'Document',
  FORMAT: 'Format',
  LAYOUT: 'Layout'
};
const TabsList = Object.values(TABS);

export const Inspector = () => {
  const [activeTab, setActiveTab] = useState(TABS.DOCUMENT);
  const selectedElement = useSelector(selectedElementSelector);

  React.useEffect(() => {
    if (selectedElement) {
      setActiveTab(TABS.FORMAT);
    }
  }, [selectedElement]);

  return (
    <InspectorContainer>
      <div>
        <Tablist margin={5} flexBasis={300}>
          {TabsList.map((tab) => (
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
        if (activeTab === TABS.DOCUMENT) {
          return <DocumentInspector />;
        } else if (activeTab === TABS.FORMAT) {
          return <FormatInspector />;
        }
      })()}
    </InspectorContainer>
  );
};
