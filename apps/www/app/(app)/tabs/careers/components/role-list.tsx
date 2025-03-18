"use client";

import { useState, useEffect } from "react";

export interface Role {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  responsibilities: string[];
  requirements: {
    mustHave: string[];
    niceToHave: string[];
  };
  compensation: {
    salary: string;
    benefits: string[];
  };
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

  const API_URL =
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.NEXT_PUBLIC_API_URL || "https://jobs-sepia.vercel.app/api";

  useEffect(() => {
    fetch(`${API_URL}/jobs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRoles(data);
        }
      })
      .catch((err) => {
        // Handle error
      });
  }, []);

  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-md">
      <h2 className="text-xl font-semibold">Open Positions</h2>
      <p className="text-xs text-muted-foreground">API Source: {API_URL}</p>
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
                }}
              >
                {role.title} <span>{expanded === role.id ? "▲" : "+"}</span>
              </button>
              {expanded === role.id && (
                <div className="mt-2 rounded-lg border border-border bg-muted p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Description:</strong> {role.fullDescription}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Responsibilities:</strong>
                    <ul className="list-inside list-disc">
                      {role.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Requirements:</strong>
                    <ul className="list-inside list-disc">
                      <li>
                        <strong>Must Have:</strong>
                        <ul>
                          {role.requirements.mustHave.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <strong>Nice to Have:</strong>
                        <ul>
                          {role.requirements.niceToHave.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Compensation:</strong> {role.compensation.salary}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Benefits:</strong>
                    <ul className="list-inside list-disc">
                      {role.compensation.benefits.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
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
