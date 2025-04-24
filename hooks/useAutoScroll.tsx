import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

const ACTIVATION_THRESHOLD = 30;
const MIN_SCROLL_UP_THRESHOLD = 10;

export function useAutoScroll(dependencies: React.DependencyList) {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const previousOffsetY = useRef<number | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const currentOffsetY = contentOffset.y;

    const distanceFromBottom =
      contentSize.height - currentOffsetY - layoutMeasurement.height;

    const isScrollingUp =
      previousOffsetY.current !== null
        ? currentOffsetY < previousOffsetY.current
        : false;

    const scrollUpDistance =
      previousOffsetY.current !== null
        ? previousOffsetY.current - currentOffsetY
        : 0;

    previousOffsetY.current = currentOffsetY;

    const isDeliberateScrollUp =
      isScrollingUp && scrollUpDistance > MIN_SCROLL_UP_THRESHOLD;

    if (isDeliberateScrollUp) {
      setShouldAutoScroll(false);
    }

    if (distanceFromBottom <= ACTIVATION_THRESHOLD) {
      setShouldAutoScroll(true);
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      showSubscription.remove();
    };
  }, [scrollViewRef]);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    scrollViewRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
  };
}
