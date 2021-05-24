import React, { useState } from 'react';
import { InspectorContainer } from './inspector-styles';
import { Tab, Tablist } from 'evergreen-ui';
import { FormatInspector } from './format-inspector';
import { DocumentInspector } from './document-inspector';
import { LayoutInspector } from './layout-inspector';
import { InspectorTab, TabValuesList } from '../../types/inspector-tabs';
import {
  useSwitchToFormatInspectorOnElementSelected,
  useSwitchToLayoutInspectorOnSlideAdded
} from '../../hooks/inspector-hooks';
import { LayerInspector } from './layer-inspector/layer-inspector';
import {
  ResizablePane,
  ResizablePaneContainer,
  ResizablePaneSplitter
} from '../resizable-pane';

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

      <ResizablePaneContainer orientation="vertical">
        <ResizablePane initialFlex={1 / 3}>
          {(() => {
            return {
              [InspectorTab.Document]: <DocumentInspector />,
              [InspectorTab.Format]: <FormatInspector />,
              [InspectorTab.Layout]: <LayoutInspector />
            }[activeTab];
          })()}
        </ResizablePane>

        <ResizablePaneSplitter />

        <ResizablePane initialFlex={1 / 3} minSize={32}>
          <LayerInspector />
        </ResizablePane>

        <ResizablePaneSplitter />

        <ResizablePane initialFlex={1 / 3} minSize={32}>
          Third pane
        </ResizablePane>
      </ResizablePaneContainer>
    </InspectorContainer>
  );
};
