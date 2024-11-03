import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "./ui/table";

interface SessionTableProps {
  sessionsHeaders: string[];
  sessionsData: any[];
}

const SessionTable = ({ sessionsHeaders, sessionsData }: SessionTableProps) => {
  return (
    <Table>
      <TableCaption>Previous Sessions</TableCaption>
      <TableHeader className="bg-zinc-100">
        <TableRow>
          {sessionsHeaders.map((header) => (
            <TableCell key={header} className="font-medium">
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessionsData.map((session) => (
          <TableRow key={session.id}>
            <TableCell>{session.id}</TableCell>
            <TableCell>{session.title}</TableCell>
            <TableCell>{session.description}</TableCell>
            <TableCell className="flex items-center">
              {session.members.map((member: any) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="w-6 h-6 rounded-full"
                />
              ))}
            </TableCell>

            {/* Actions */}
            <TableCell>
              <Button size={"icon"} variant={"ghost"}>
                <Ellipsis size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SessionTable;
