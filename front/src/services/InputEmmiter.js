import { BehaviorSubject } from "rxjs";

const rangeMinMaxValues = new BehaviorSubject([]);
const rangeEmmiter = new BehaviorSubject([]);

export default {
  rangeMinMaxValues,
  rangeEmmiter,
};
