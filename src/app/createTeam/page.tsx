import CreateTeam from "@/components/createTeams";
import { useSession } from "next-auth/react";

const MatchesPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div className="min-h-screen p-2 sm:p-6">
      <CreateTeam />
    </div>
  );
};

export default MatchesPage;