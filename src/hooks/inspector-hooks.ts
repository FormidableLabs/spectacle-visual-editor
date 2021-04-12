import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectedElementSelector } from '../slices/deck-slice';
import { InspectorTab } from '../types/inspector-tabs';
import { UseStateSetter } from '../types/util-types';
import { useSlideNodes } from './use-slide-nodes';
import { usePrevious } from 'react-use';

export const useSwitchToFormatInspectorOnElementSelected = ({
  setActiveTab
}: {
  setActiveTab: UseStateSetter<InspectorTab>;
}) => {
  const selectedElement = useSelector(selectedElementSelector);
  useEffect(() => {
    if (selectedElement) {
      setActiveTab(InspectorTab.Format);
    }
  }, [selectedElement, setActiveTab]);
};

export const useSwitchToLayoutInspectorOnSlideAdded = ({
  setActiveTab
}: {
  setActiveTab: UseStateSetter<InspectorTab>;
}) => {
  const numSlides = useSlideNodes()?.slideNodes?.length || 0;
  const prevNumSlides = usePrevious(numSlides) || 0;

  useEffect(() => {
    if (prevNumSlides > 0 && numSlides > prevNumSlides) {
      setActiveTab(InspectorTab.Layout);
    }
  }, [numSlides, prevNumSlides, setActiveTab]);
};
