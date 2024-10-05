import { ArrowRight } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";

const FastCreation = ({ handleCreate }: { handleCreate: () => void }) => (
  <Card className="bg-primary/5">
    <CardHeader>
      <CardTitle>Fast Whitelist Creation</CardTitle>
      <CardDescription>Skip manual entry and create your whitelist instantly</CardDescription>
    </CardHeader>
    <CardContent>
      <Button size="lg" onClick={handleCreate} className="w-full">
        Create with One Click <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

export default FastCreation;
