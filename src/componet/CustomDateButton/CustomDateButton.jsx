import React, { forwardRef } from "react";

const CustomDateButton = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={onClick}
    ref={ref}
    style={{ minWidth: "120px" }}
  >
    {value || "Select Date"}
  </button>
));

export default CustomDateButton;
