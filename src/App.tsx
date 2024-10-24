import { useEffect, useState, ChangeEvent } from "react";
import { invoke } from "@tauri-apps/api/core";

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
    <div className="App">
      <h1>Git Account Switcher</h1>

      {/* Display the current Git Info */}
      <div>
        <h2>Current Git Info</h2>
        <p>
          <strong>Name:</strong> {currentGit.name}
        </p>
        <p>
          <strong>Email:</strong> {currentGit.email}
        </p>
      </div>

      {/* Personal Git Info Form */}
      <div>
        <h2>Personal Git Info</h2>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={personalGit.name}
            onChange={handlePersonalChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={personalGit.email}
            onChange={handlePersonalChange}
          />
        </label>
        <button onClick={() => handleSubmit("personal")}>
          Switch to Personal
        </button>
      </div>

      {/* Work Git Info Form */}
      <div>
        <h2>Work Git Info</h2>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={workGit.name}
            onChange={handleWorkChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={workGit.email}
            onChange={handleWorkChange}
          />
        </label>
        <button onClick={() => handleSubmit("work")}>Switch to Work</button>
      </div>
    </div>
  );
}

export default App;
