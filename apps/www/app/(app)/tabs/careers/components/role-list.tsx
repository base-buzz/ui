"use client";

import { useState, useEffect } from "react";

export interface Role {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
}

export default function RoleList({
  selectedRole,
  setSelectedRole,
}: {
  selectedRole: Role | null;
  setSelectedRole: (role: Role) => void;
}) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://jobs-sepia.vercel.app/api";

    console.log("🌍 Fetching jobs from:", API_URL);

    fetch(`${API_URL}/jobs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Successfully fetched jobs:", data);
        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          console.error("⚠️ Unexpected API response format:", data);
        }
      })
      .catch((err) => console.error("❌ Error fetching jobs:", err));
  }, []);

  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-md">
      <h2 className="text-xl font-semibold">Open Positions</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
        {roles.length === 0 ? (
          <p className="text-muted-foreground">No job listings available.</p>
        ) : (
          roles.map((role) => (
            <li key={role.id}>
              <button
                className="flex w-full items-center justify-between text-left font-medium hover:text-primary"
                onClick={() => {
                  setExpanded(expanded === role.id ? null : role.id);
                  setSelectedRole(role);
                  console.log("📌 Selected Role:", role);
                }}
              >
                {role.title} <span>{expanded === role.id ? "▲" : "+"}</span>
              </button>
              {expanded === role.id && (
                <div className="mt-2 rounded-lg border border-border bg-muted p-4">
                  <p className="text-xs text-muted-foreground">
                    {role.fullDescription}
                  </p>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
