import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { GitConfig } from "@/types/git";

export function useGitConfig() {
  const [currentGit, setCurrentGit] = useState<GitConfig>({
    name: "",
    email: "",
  });
  const [personalGit, setPersonalGit] = useState<GitConfig>({
    name: "",
    email: "",
  });
  const [workGit, setWorkGit] = useState<GitConfig>({
    name: "",
    email: "",
  });

  const fetchCurrentGitConfig = async () => {
    try {
      const gitConfig = await invoke<GitConfig>("get_git_config");
      setCurrentGit(gitConfig);
    } catch (error) {
      console.error("Failed to load git config", error);
    }
  };

  const loadStoredGitInfo = () => {
    const storedPersonalGit = localStorage.getItem("personalGit");
    const storedWorkGit = localStorage.getItem("workGit");

    if (storedPersonalGit) setPersonalGit(JSON.parse(storedPersonalGit));
    if (storedWorkGit) setWorkGit(JSON.parse(storedWorkGit));
  };

  const saveToLocalStorage = (key: string, value: GitConfig) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const handleGitConfigChange = (
    type: "personal" | "work",
    name: string,
    value: string
  ) => {
    const updatedConfig = {
      ...(type === "personal" ? personalGit : workGit),
      [name]: value,
    };

    if (type === "personal") {
      setPersonalGit(updatedConfig);
      saveToLocalStorage("personalGit", updatedConfig);
    } else {
      setWorkGit(updatedConfig);
      saveToLocalStorage("workGit", updatedConfig);
    }
  };

  const switchGitAccount = async (accountType: "personal" | "work") => {
    const gitInfo = accountType === "personal" ? personalGit : workGit;
    try {
      await invoke("switch_git_account", { accountType, gitInfo });
      await fetchCurrentGitConfig();
    } catch (error) {
      console.error(error);
    }
  };

  const clearGitConfig = async () => {
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

  useEffect(() => {
    fetchCurrentGitConfig();
    loadStoredGitInfo();
  }, []);

  return {
    currentGit,
    personalGit,
    workGit,
    handleGitConfigChange,
    switchGitAccount,
    clearGitConfig,
  };
}
