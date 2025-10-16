import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Type alias for Value to support both single date and range
type Value = Date | [Date, Date] | null;

const CalendarWidget: React.FC = () => {
  // You can default to new Date(), or null based on initial design
  const [selected, setSelected] = useState<Value>(new Date());

  // Handler matches what react-calendar expects
  function handleChange(value: Value) {
    setSelected(value);
  }

  return (
    <div>
      <Calendar
        selectRange={true} // Enable range selection
        value={selected}
        onChange={handleChange}
      />
      <div>
        {/* Display selected value(s) */}
        Selected:
        {Array.isArray(selected)
          ? `From ${selected[0]?.toLocaleDateString()} to ${selected[1]?.toLocaleDateString()}`
          : selected
          ? selected.toLocaleDateString()
          : 'None'}
      </div>
    </div>
  );
};

export default CalendarWidget;
