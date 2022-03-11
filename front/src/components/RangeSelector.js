import { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import subjects from "../services/InputEmmiter";

const RangeSelector = () => {
  const [values, setValues] = useState([]);
  const [minMax, setMinMax] = useState([]);

  useEffect(() => {
    const subscription = subjects.rangeMinMaxValues.subscribe((array) => {
      setMinMax(array);
      setValues(array);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="range-container">
      {values.length > 0 ? (
        <Range
          values={values}
          // it is advised for range component to calculate steps by itself for performance reasons
          step={(minMax[1] - minMax[0]) / (minMax[1] - minMax[0])}
          min={minMax[0]}
          max={minMax[1]}
          onChange={(values) => {
            setValues(values);
            subjects.rangeEmmiter.next(values);
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                position: "relative",
                height: "30px",
                display: "flex",
                width: "100%",
                backgroundColor: "#f0f0f0",
                boxShadow: "10px 10px 15px #adadad, -10px -10px 6px #ffffff",
                borderRadius: "4px",
              }}
            >
              <div
                ref={props.ref}
                className="range-track"
                style={{
                  height: "18px",
                  position: "relative",
                  width: "98%",
                  left: "1%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values,
                    colors: ["#ccc", "hsl(240, 100%, 50%)", "#ccc"],
                    min: minMax[0],
                    max: minMax[1],
                  }),
                  alignSelf: "center",
                  cursor: "pointer",
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
                height: "48px",
                width: "48px",
                borderRadius: "100%",
                backgroundColor: "#FFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "3px solid #ffffff",
                boxShadow: "3px 5px 8px #9f9f9f",
                zIndex: 5,
                background: "linear-gradient(145deg, #ffffff, #bcbcbc)",
                cursor: "pointer",
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
                  backgroundColor: isDragged ? "blue" : "gray",
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
