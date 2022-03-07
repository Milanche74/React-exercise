import { useState } from "react";
import { Range, getTrackBackground } from "react-range";

const RangeSelector = () => {
  const [values, setValues] = useState([13, 78]);
  return (
    <Range
      values={values}
      step={1}
      min={1}
      max={100}
      onChange={(values) => {
        setValues(values);
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
                min: 1,
                max: 100,
              }),
              alignSelf: "center",
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => (
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
              height: "16px",
              width: "5px",
              backgroundColor: isDragged ? "red" : "yellow",
            }}
          ></div>
        </div>
      )}
    />
  );
};
export default RangeSelector;
