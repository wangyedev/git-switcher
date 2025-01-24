import { GitConfig } from "@/types/git";

interface CurrentGitInfoProps {
  currentGit: GitConfig;
}

export function CurrentGitInfo({ currentGit }: CurrentGitInfoProps) {
  return (
    <div className="flex flex-col gap-2 bg-slate-100 rounded-md p-4">
      <h2 className="text-lg font-semibold">Current Git Info</h2>
      <div className="flex flex-col gap-2">
        <p>
          <strong>Name:</strong> {currentGit.name}
        </p>
        <p>
          <strong>Email:</strong> {currentGit.email}
        </p>
      </div>
    </div>
  );
}
