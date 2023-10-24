import React from "react";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return pending ? (
    <Button variant={"outline"} aria-disabled={pending}>
      <Spinner />
    </Button>
  ) : (
    <Button aria-disabled={pending}>Book</Button>
  );
};

export default SubmitButton;
