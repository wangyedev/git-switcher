import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitConfig } from "@/types/git";

interface GitConfigFormProps {
  type: "personal" | "work";
  gitConfig: GitConfig;
  currentGit: GitConfig;
  onConfigChange: (
    type: "personal" | "work",
    name: string,
    value: string
  ) => void;
  onSubmit: (type: "personal" | "work") => void;
}

export function GitConfigForm({
  type,
  gitConfig,
  currentGit,
  onConfigChange,
  onSubmit,
}: GitConfigFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onConfigChange(type, name, value);
  };

  const isDisabled =
    !gitConfig.name ||
    !gitConfig.email ||
    (gitConfig.name === currentGit.name &&
      gitConfig.email === currentGit.email);

  return (
    <div className="flex flex-col gap-2 rounded-md p-4">
      <h2 className="text-lg font-semibold">
        {type === "personal" ? "Personal" : "Work"} Git Info
      </h2>
      <div className="flex flex-col gap-2">
        <Label className="flex flex-col gap-2">
          Name:
          <Input
            type="text"
            name="name"
            value={gitConfig.name}
            onChange={handleChange}
          />
        </Label>

        <Label className="flex flex-col gap-2">
          Email:
          <Input
            type="email"
            name="email"
            value={gitConfig.email}
            onChange={handleChange}
          />
        </Label>
      </div>

      <Button onClick={() => onSubmit(type)} disabled={isDisabled}>
        Switch to {type === "personal" ? "Personal" : "Work"}
      </Button>
    </div>
  );
}
