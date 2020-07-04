import { Dimensions } from 'react-native';
const { width: ww, height: wh } = Dimensions.get('window');

export const getww = percent => (ww * percent) / 100;

export const getwh = percent => (wh * percent) / 100;
