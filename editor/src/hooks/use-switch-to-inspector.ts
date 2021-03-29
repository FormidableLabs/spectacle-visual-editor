import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectedElementSelector } from '../slices/deck-slice';
import { InspectorTab } from '../types/inspector-tabs';

export const useSwitchToFormatInspectorOnElementSelected = ({
  setActiveTab
}: {
  setActiveTab(tab: InspectorTab): void;
}) => {
  const selectedElement = useSelector(selectedElementSelector);
  useEffect(() => {
    if (selectedElement) {
      setActiveTab(InspectorTab.Format);
    }
  }, [selectedElement, setActiveTab]);
};
