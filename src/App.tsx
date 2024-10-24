import { useEffect, useState, ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css"; // Adjust the path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Setting from "@/components/Setting/Setting";
// Define types for Git information
interface GitConfig {
  name: string;
  email: string;
}

function App() {
  // Store the current Git config (name and email)
  const [currentGit, setCurrentGit] = useState<GitConfig>({
    name: "",
    email: "",
  });
  const [personalGit, setPersonalGit] = useState<GitConfig>({
    name: "",
    email: "",
  });
  const [workGit, setWorkGit] = useState<GitConfig>({ name: "", email: "" });

  // Fetch current Git config on component mount
  useEffect(() => {
    fetchCurrentGitConfig();
    loadStoredGitInfo();
  }, []);

  // Load saved Git info from localStorage
  const loadStoredGitInfo = () => {
    const storedPersonalGit = localStorage.getItem("personalGit");
    const storedWorkGit = localStorage.getItem("workGit");

    if (storedPersonalGit) setPersonalGit(JSON.parse(storedPersonalGit));
    if (storedWorkGit) setWorkGit(JSON.parse(storedWorkGit));
  };

  const fetchCurrentGitConfig = () => {
    invoke<GitConfig>("get_git_config")
      .then((gitConfig) => {
        setCurrentGit(gitConfig); // Update the current Git config
      })
      .catch((error) => console.error("Failed to load git config", error));
  };

  // Save Git info to localStorage
  const saveToLocalStorage = (key: string, value: GitConfig) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Handle personal Git info changes
  const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedPersonalGit = { ...personalGit, [name]: value };
    setPersonalGit(updatedPersonalGit);
    saveToLocalStorage("personalGit", updatedPersonalGit); // Save personal info to localStorage
  };

  // Handle work Git info changes
  const handleWorkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedWorkGit = { ...workGit, [name]: value };
    setWorkGit(updatedWorkGit);
    saveToLocalStorage("workGit", updatedWorkGit); // Save work info to localStorage
  };

  // Submit Git info for switching accounts
  const handleSubmit = (accountType: "personal" | "work") => {
    const gitInfo = accountType === "personal" ? personalGit : workGit;
    invoke("switch_git_account", { accountType, gitInfo })
      .then(() => {
        fetchCurrentGitConfig(); // Refresh the current Git info
      })
      .catch((error) => console.error(error));
  };

  const handleClearGitConfig = async () => {
    try {
      await invoke("reset_git_config");
      await fetchCurrentGitConfig();

      localStorage.removeItem("personalGit");
      localStorage.removeItem("workGit");
      setPersonalGit({ name: "", email: "" });
      setWorkGit({ name: "", email: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto my-4 space-y-4">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">Git Account Switcher</h1>
        <Setting handleClearGitConfig={handleClearGitConfig} />
      </div>

      {/* Display the current Git Info */}
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

      {/* Personal Git Info Form */}
      <div className="flex flex-col gap-2 rounded-md p-4 ">
        <h2 className="text-lg font-semibold ">Personal Git Info</h2>
        <div className="flex flex-col gap-2">
          <Label className="flex flex-col gap-2">
            Name:
            <Input
              type="text"
              name="name"
              value={personalGit.name}
              onChange={handlePersonalChange}
            />
          </Label>

          <Label className="flex flex-col gap-2">
            Email:
            <Input
              type="email"
              name="email"
              value={personalGit.email}
              onChange={handlePersonalChange}
            />
          </Label>
        </div>

        <Button
          onClick={() => handleSubmit("personal")}
          disabled={
            !personalGit.name ||
            !personalGit.email ||
            (personalGit.name === currentGit.name &&
              personalGit.email === currentGit.email)
          }
        >
          Switch to Personal
        </Button>
      </div>

      {/* Work Git Info Form */}
      <div className="flex flex-col gap-2 rounded-md p-4">
        <h2 className="text-lg font-semibold ">Work Git Info</h2>
        <div className="flex flex-col gap-2">
          <Label className="flex flex-col gap-2">
            Name:
            <Input
              type="text"
              name="name"
              value={workGit.name}
              onChange={handleWorkChange}
            />
          </Label>

          <Label className="flex flex-col gap-2">
            Email:
            <Input
              type="email"
              name="email"
              value={workGit.email}
              onChange={handleWorkChange}
            />
          </Label>
        </div>

        <Button
          onClick={() => handleSubmit("work")}
          disabled={
            !workGit.name ||
            !workGit.email ||
            (workGit.name === currentGit.name &&
              workGit.email === currentGit.email)
          }
        >
          Switch to Work
        </Button>
      </div>
    </div>
  );
}

export default App;
