import GenerateForm from "~~/components/early-access/owner/GenerateForm";

const EarlyAccessOwnerPage = () => {
  return (
    <div className="flex flex-col gap-10 justify-center">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold">Owner page</h3>
        <p>This page is only accessible by the owner of the early access program.</p>
      </div>
      <GenerateForm />
    </div>
  );
};

export default EarlyAccessOwnerPage;
