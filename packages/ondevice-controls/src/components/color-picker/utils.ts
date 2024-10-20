import tinycolor, { ColorFormats } from 'tinycolor2';
import { PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

type Point = { x: number; y: number };

interface PanResponderCallbacks {
  onStart?: (
    point: Point,
    evt: GestureResponderEvent,
    state: PanResponderGestureState
  ) => boolean | void;
  onMove?: (
    point: Point,
    evt: GestureResponderEvent,
    state: PanResponderGestureState
  ) => boolean | void;
  onEnd?: (
    point: Point,
    evt: GestureResponderEvent,
    state: PanResponderGestureState
  ) => boolean | void;
}

/**
 * Converts color to hsv representation.
 * @param {string} color any color representation - name, hexa, rgb
 * @return {object} { h: number, s: number, v: number } object literal
 */
export function toHsv(color: string): ColorFormats.HSV {
  return tinycolor(color).toHsv();
}

/**
 * Converts hsv object to hexa color string.
 * @param {object} hsv { h: number, s: number, v: number } object literal
 * @return {string} color in hexa representation
 */
export function fromHsv(hsv: ColorFormats.HSV): string {
  return tinycolor(hsv).toHexString();
}

const fn = () => true;

/**
 * Simplified pan responder wrapper.
 */
export function createPanResponder({
  onStart = fn,
  onMove = fn,
  onEnd = fn,
}: PanResponderCallbacks) {
  return PanResponder.create({
    onStartShouldSetPanResponder: fn,
    onStartShouldSetPanResponderCapture: fn,
    onMoveShouldSetPanResponder: fn,
    onMoveShouldSetPanResponderCapture: fn,
    onPanResponderTerminationRequest: fn,
    onPanResponderGrant: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      return onStart({ x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY }, evt, state);
    },
    onPanResponderMove: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      return onMove({ x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY }, evt, state);
    },
    onPanResponderRelease: (evt: GestureResponderEvent, state: PanResponderGestureState) => {
      return onEnd({ x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY }, evt, state);
    },
  });
}

/**
 * Rotates point around given center in 2d.
 * Point is object literal { x: number, y: number }
 * @param {point} point to be rotated
 * @param {number} angle in radians
 * @param {point} center to be rotated around
 * @return {point} rotated point
 */
export function rotatePoint(point: Point, angle: number, center: Point = { x: 0, y: 0 }): Point {
  // translation to origin
  const transOriginX = point.x - center.x;
  const transOriginY = point.y - center.y;

  // rotation around origin
  const rotatedX = transOriginX * Math.cos(angle) - transOriginY * Math.sin(angle);
  const rotatedY = transOriginY * Math.cos(angle) + transOriginX * Math.sin(angle);

  // translate back from origin
  const normalizedX = rotatedX + center.x;
  const normalizedY = rotatedY + center.y;
  return {
    x: normalizedX,
    y: normalizedY,
  };
}
