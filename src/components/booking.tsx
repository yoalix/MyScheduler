import React from "react";
import { Input } from "./ui/input";
import { state } from "@/store";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const locations = [
  {
    name: "Phone",
    value: "phone",
  },
  {
    name: "Google Meet",
    value: "meet",
  },
];

const Booking = () => {
  return (
    <div className="flex flex-col gap-5">
      <Input
        placeholder="Name"
        onChange={(e) => (state.name = e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        onChange={(e) => (state.email = e.target.value)}
      />
      <RadioGroup defaultValue="comfortable">
        {locations.map((location, i) => (
          <div key={location.name} className="flex items-center space-x-2">
            <RadioGroupItem
              value={location.value}
              id={`radio-${i}`}
              onClick={(e) => (state.location = location.value)}
            />
            <Label htmlFor={`radio-${i}`}>{location.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Booking;
