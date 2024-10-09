import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { WhitelistedAddresses } from "~~/types/whitelist";

const WhitelistedTable = ({ whitelistedAddresses }: { whitelistedAddresses: WhitelistedAddresses[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Whitelisted Addresses</CardTitle>
        <CardDescription>Displaying addresses that have consumed codes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Wallet Address</TableHead>
                <TableHead className="w-1/2">Consumed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whitelistedAddresses.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhitelistedTable;
