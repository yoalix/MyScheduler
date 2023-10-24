import React from "react";

// @ts-expect-error
import { experimental_useFormStatus as useFormStatus } from "react-dom";
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
