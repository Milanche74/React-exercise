import { BehaviorSubject } from "rxjs";

const rangeMinMaxValues = new BehaviorSubject([]);
const rangeEmmiter = new BehaviorSubject([]);

const subjects = {
  rangeEmmiter,
  rangeMinMaxValues,
};

export default subjects;
