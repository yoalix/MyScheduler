import React from "react";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  console.log({ pending });
  return pending ? (
    <Button variant={"outline"} aria-disabled={pending}>
      <Spinner />
    </Button>
  ) : (
    <Button aria-disabled={pending}>Book</Button>
  );
};

export default SubmitButton;
