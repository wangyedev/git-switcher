import { useEffect, useState, ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css"; // Adjust the path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        alert(`Switched to ${accountType} account`);
        fetchCurrentGitConfig(); // Refresh the current Git info
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col items-center h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Git Account Switcher</h1>

      {/* Display the current Git Info */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold mb-2">Current Git Info</h2>
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
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold mb-2">Personal Git Info</h2>
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

        <Button onClick={() => handleSubmit("personal")}>
          Switch to Personal
        </Button>
      </div>

      {/* Work Git Info Form */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold mb-2">Work Git Info</h2>
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

        <Button onClick={() => handleSubmit("work")}>Switch to Work</Button>
      </div>
    </div>
  );
}

export default App;
