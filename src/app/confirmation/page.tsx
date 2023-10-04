import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Confirmation() {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl">Thanks!</CardTitle>
        </CardHeader>
        <CardDescription className=""></CardDescription>
        <CardContent>I’ll get back to you as soon as possible.</CardContent>
      </Card>
    </div>
  );
}
