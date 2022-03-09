import { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import InputEmmiter from "../services/InputEmmiter";

const RangeSelector = () => {
  const [values, setValues] = useState([]);
  const [minMax, setMinMax] = useState([]);

  useEffect(() => {
    const subscription = InputEmmiter.rangeMinMaxValues.subscribe((array) => {
      setMinMax(array);
      setValues(array);
    });
    return () => subscription.unsubscribe();
  }, []);
  return (
    <div>
      {values.length > 0 ? (
        <Range
          values={values}
          step={1}
          min={minMax[0]}
          max={minMax[1]}
          onChange={(values) => {
            setValues(values);
            InputEmmiter.rangeEmmiter.next(values);
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "24px",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "5px",
                  width: "100%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values,
                    colors: ["#ccc", "#548BF4", "#ccc"],
                    min: minMax[0],
                    max: minMax[1],
                  }),
                  alignSelf: "center",
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ index, props, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "42px",
                width: "42px",
                borderRadius: "4px",
                backgroundColor: "#FFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 2px 6px #AAA",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-28px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  padding: "4px",
                  borderRadius: "4px",
                  backgroundColor: "#548BF4",
                }}
              >
                {parseFloat(values[index]?.toFixed(1))}
              </div>
              <div
                style={{
                  height: "16px",
                  width: "5px",
                  backgroundColor: isDragged ? "blue" : "yellow",
                }}
              ></div>
            </div>
          )}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default RangeSelector;
