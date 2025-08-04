import "./App.css";
import { useGitConfig } from "@/hooks/useGitConfig";
import { CurrentGitInfo } from "@/components/GitInfo/CurrentGitInfo";
import { GitConfigForm } from "@/components/GitInfo/GitConfigForm";
import Setting from "@/components/Setting/Setting";

function App() {
  const {
    currentGit,
    personalGit,
    workGit,
    handleGitConfigChange,
    switchGitAccount,
    clearGitConfig,
  } = useGitConfig();

  return (
    <div className="container mx-auto my-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dev Studio</h1>
        <Setting handleClearGitConfig={clearGitConfig} />
      </div>

      <CurrentGitInfo currentGit={currentGit} />

      <GitConfigForm
        type="personal"
        gitConfig={personalGit}
        currentGit={currentGit}
        onConfigChange={handleGitConfigChange}
        onSubmit={switchGitAccount}
      />

      <GitConfigForm
        type="work"
        gitConfig={workGit}
        currentGit={currentGit}
        onConfigChange={handleGitConfigChange}
        onSubmit={switchGitAccount}
      />
    </div>
  );
}

export default App;
