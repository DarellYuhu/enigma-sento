import { CreateProposalForm } from "./components/create-proposal-form";
import { ProposalList } from "./components/proposal-list";

export default function ProposalPage() {
  return (
    <div className="space-y-4">
      <CreateProposalForm />
      <ProposalList />
    </div>
  );
}
