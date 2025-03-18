"use client";

import { useState } from "react";

// Explicitly define a type for roles
export type Role = {
  title: string;
  description: string;
  fullDescription: string;
};

// Ensure `roles` array conforms to the `Role` type
export const roles: Role[] = [
  {
    title: "AI Engineer",
    description:
      "Develop AI-driven DeFi tools, trading models, and automated governance mechanisms. Collaborate with blockchain engineers and data scientists to build cutting-edge solutions.",
    fullDescription:
      "As an AI Engineer at BaseBuzz, you will be responsible for developing and optimizing AI-driven DeFi strategies, predictive analytics, and automated trading models. The role involves integrating AI models with smart contracts, ensuring scalability, security, and efficiency.",
  },
  {
    title: "Blockchain Developer (EVM)",
    description:
      "Build and optimize smart contracts on Base and other EVM-compatible chains. Enhance protocol security and efficiency.",
    fullDescription:
      "As an EVM Blockchain Developer, you will design, deploy, and optimize smart contracts for DeFi applications. Your role will include gas optimization, smart contract security, and seamless integration with frontend applications.",
  },
  {
    title: "Blockchain Developer (Solana)",
    description:
      "Develop high-performance Solana programs for DeFi, tokenized assets, and governance.",
    fullDescription:
      "This role involves writing and optimizing Solana programs in Rust, ensuring security and high performance. You will collaborate with front-end teams to integrate Solana smart contracts into dApps and contribute to the broader Solana ecosystem.",
  },
  {
    title: "Blockchain Developer (Cross-Chain)",
    description:
      "Integrate cross-chain solutions, bridges, and interoperability protocols.",
    fullDescription:
      "As a Cross-Chain Developer, you will design and implement interoperability protocols between different blockchain networks. Your work will enable smooth asset transfers and data communication between Base, Solana, and other networks.",
  },
  {
    title: "Market Analyst",
    description:
      "Analyze DeFi trends, tokenomics, and market activity to inform trading strategies.",
    fullDescription:
      "Your primary responsibilities include tracking emerging DeFi trends, evaluating tokenomics models, and providing actionable insights for traders and developers. Strong data analysis and research skills are required.",
  },
  {
    title: "Social Media Manager (General)",
    description:
      "Manage BaseBuzz's social presence, drive engagement, and grow our community.",
    fullDescription:
      "You will oversee social media channels, create engaging content, and develop marketing strategies to expand BaseBuzz's reach. Experience with crypto communities and social engagement is preferred.",
  },
  {
    title: "Frontend Developer",
    description:
      "Develop high-performance UI with Next.js, Tailwind, Wagmi, ShadCN, and Supabase.",
    fullDescription:
      "As a Frontend Developer, you will build and maintain the user interface of BaseBuzz’s ecosystem. The role requires proficiency in Next.js, Tailwind, Web3 wallet integrations, and a strong understanding of user experience in DeFi applications.",
  },
  {
    title: "GitHub Engineer",
    description:
      "Manage repositories, CI/CD pipelines, and contributor onboarding for BaseBuzz projects.",
    fullDescription:
      "Your role includes managing the codebase, reviewing PRs, automating CI/CD workflows, and ensuring a seamless developer experience within BaseBuzz’s GitHub ecosystem.",
  },
];

// Explicitly type props
interface RoleListProps {
  selectedRole: Role | null;
  setSelectedRole: (role: Role) => void;
}

export default function RoleList({
  selectedRole,
  setSelectedRole,
}: RoleListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-md">
      <h2 className="text-xl font-semibold">Open Positions</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
        {roles.map((role) => (
          <li key={role.title}>
            <button
              className="flex w-full items-center justify-between text-left font-medium hover:text-primary"
              onClick={() => setSelectedRole(role)}
            >
              {role.title} <span>+</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
